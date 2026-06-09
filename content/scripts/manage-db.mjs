#!/usr/bin/env node
// @ts-check
/*
 * manage-db.mjs — manage Postgres roles & permissions for the shared `website`
 * database on Azure Database for PostgreSQL (Flexible Server).
 *
 * Why this exists
 * ---------------
 * One database is shared by two apps:
 *   - cms_user  (Strapi)   : owns + migrates ALL tables (full DDL/DML).
 *   - web_user  (frontend) : read-only, and ONLY on an explicit allow-list of
 *                            tables (the Next.js app is SELECT-only on `blogs`
 *                            and `notes` — see src/app/_dataprovider/).
 *
 * Reads flow through a NOLOGIN GROUP role (app_readonly): the group is granted
 * SELECT on exactly the allow-list tables, and web_user is a member of it.
 * web_user holds no direct grants of its own.
 *
 * Target state this converges to (idempotent):
 *   - cms_user owns every table; the admin is a member of cms_user so it can
 *     ALTER/DROP any table as itself (no SET ROLE).
 *   - app_readonly has SELECT on ONLY the allow-list tables. No default
 *     privileges are set, so NEW tables stay unreadable until explicitly added.
 *   - Any stray/over-privileged grants on web_user / app_readonly are revoked.
 *   - The admin is removed from the app roles (best-effort cleanup).
 *   - Optionally drops a leftover login role (e.g. a stale Entra admin).
 *   - Azure defaults (public schema owner, PUBLIC usage) are left untouched.
 *
 * Everything runs inside a single transaction: if anything fails, the whole
 * change rolls back — the database is never left half-applied. Risky cleanup
 * steps use SAVEPOINTs so a recoverable error degrades to a warning instead of
 * aborting the run.
 *
 * Connection
 * ----------
 * Host / database / port / sslmode default from ../.env (content/.env:
 * DATABASE_HOST, DATABASE_NAME, DATABASE_PORT, DATABASE_SSL). The ADMIN login is
 * NOT stored there: provide it via env vars or you'll be prompted.
 *   PGUSER / PGPASSWORD            admin login (prompted if missing)
 *   PGHOST PGPORT PGDATABASE PGSSLMODE   override the ../.env defaults
 *   CMS_DB_PASSWORD WEB_DB_PASSWORD       only to create/rotate those roles
 *
 * Usage
 *   node scripts/manage-db.mjs status
 *   PGUSER=sanskar PGPASSWORD=... node scripts/manage-db.mjs apply
 *   ... apply --read-tables "blogs notes recipes"
 *   ... apply --drop-role 'old-entra#EXT#@...'
 *   ... apply --dry-run        # print SQL, do not connect
 *
 * Commands: status (default) | apply | bootstrap
 * Flags:
 *   --read-tables "<list>"  allow-list web_user may read (default "blogs notes")
 *   --read-role <name>      group role name (default app_readonly)
 *   --cms-role <name>       Strapi role (default cms_user)
 *   --web-role <name>       frontend role (default web_user)
 *   --drop-role <name>      drop this login role if it exists
 *   --dry-run               print the SQL without executing
 *   -h, --help              show this help
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_ENV = join(__dirname, "..", ".env");

const IDENT = /^[A-Za-z_][A-Za-z0-9_]*$/;
const isIdent = (s) => IDENT.test(s);
/** Quote a SQL identifier (double quotes, doubling embedded quotes). */
const qid = (s) => `"${String(s).replace(/"/g, '""')}"`;
/** Quote a SQL string literal. */
const qlit = (s) => `'${String(s).replace(/'/g, "''")}'`;

function parseArgs(argv) {
  const opts = {
    command: "status",
    readTables: "blogs notes",
    readRole: "app_readonly",
    cmsRole: "cms_user",
    webRole: "web_user",
    dropRole: "",
    dryRun: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case "status":
      case "apply":
      case "bootstrap":
        opts.command = a;
        break;
      case "--read-tables": opts.readTables = argv[++i]; break;
      case "--read-role": opts.readRole = argv[++i]; break;
      case "--cms-role": opts.cmsRole = argv[++i]; break;
      case "--web-role": opts.webRole = argv[++i]; break;
      case "--drop-role": opts.dropRole = argv[++i] ?? ""; break;
      case "--dry-run": opts.dryRun = true; break;
      case "-h":
      case "--help":
        printHelp();
        process.exit(0);
        break;
      default:
        console.error(`Unknown argument: ${a}`);
        process.exit(1);
    }
  }
  for (const [k, v] of [
    ["read-role", opts.readRole],
    ["cms-role", opts.cmsRole],
    ["web-role", opts.webRole],
  ]) {
    if (!isIdent(v)) {
      console.error(`Error: invalid ${k} '${v}'.`);
      process.exit(1);
    }
  }
  opts.tables = String(opts.readTables)
    .split(/[\s,]+/)
    .filter(Boolean);
  for (const t of opts.tables) {
    if (!isIdent(t)) {
      console.error(`Error: invalid read table '${t}'.`);
      process.exit(1);
    }
  }
  if (opts.dropRole && /['\n]/.test(opts.dropRole)) {
    console.error("Error: invalid --drop-role value.");
    process.exit(1);
  }
  return opts;
}

function printHelp() {
  const src = readFileSync(fileURLToPath(import.meta.url), "utf8");
  const banner = src.slice(src.indexOf("/*") + 2, src.indexOf("*/"));
  console.log(banner.trim());
}

/** Minimal dotenv reader: KEY=value, strips matching surrounding quotes. */
function readEnvFile(path) {
  const out = {};
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    return out;
  }
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      val.length >= 2 &&
      ((val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'")))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

async function prompt(question, { secret = false } = {}) {
  const rl = createInterface({ input: stdin, output: stdout, terminal: true });
  try {
    if (!secret) return (await rl.question(question)).trim();
    // Hide input for secrets.
    const onData = () => {
      stdout.write("\x1b[2K\r" + question);
    };
    stdout.write(question);
    stdin.on("data", onData);
    const answer = await rl.question("");
    stdin.off("data", onData);
    stdout.write("\n");
    return answer.trim();
  } finally {
    rl.close();
  }
}

async function resolveConnection() {
  const fileEnv = readEnvFile(CONTENT_ENV);
  const sslRaw = process.env.PGSSLMODE
    ? process.env.PGSSLMODE !== "disable"
    : (fileEnv.DATABASE_SSL ?? "true") !== "false";

  const conn = {
    host: process.env.PGHOST || fileEnv.DATABASE_HOST || "",
    port: Number(process.env.PGPORT || fileEnv.DATABASE_PORT || 5432),
    database: process.env.PGDATABASE || fileEnv.DATABASE_NAME || "website",
    user: process.env.PGUSER || "",
    password: process.env.PGPASSWORD || "",
    ssl: sslRaw ? { rejectUnauthorized: false } : false,
  };
  if (!conn.host) conn.host = await prompt("Postgres host (PGHOST): ");
  if (!conn.user) conn.user = await prompt("Admin username (PGUSER): ");
  if (!conn.password)
    conn.password = await prompt("Admin password (PGPASSWORD): ", {
      secret: true,
    });
  return conn;
}

/* ------------------------------ SQL builders ------------------------------ */

function buildApplyPlan(opts, admin) {
  const cms = qid(opts.cmsRole);
  const web = qid(opts.webRole);
  const read = qid(opts.readRole);
  const adm = qid(admin);

  // Critical steps run in the main transaction.
  const critical = [
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname=${qlit(
      opts.cmsRole
    )}) THEN CREATE ROLE ${cms} LOGIN; END IF; END $$;`,
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname=${qlit(
      opts.webRole
    )}) THEN CREATE ROLE ${web} LOGIN; END IF; END $$;`,
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname=${qlit(
      opts.readRole
    )}) THEN CREATE ROLE ${read} NOLOGIN; END IF; END $$;`,
    // web_user is least-privilege (NOSUPERUSER omitted: Azure forbids touching it).
    `ALTER ROLE ${web} WITH NOCREATEDB NOCREATEROLE;`,
    `GRANT ${read} TO ${web};`,
    `GRANT USAGE, CREATE ON SCHEMA public TO ${cms};`,
    `GRANT USAGE ON SCHEMA public TO ${read};`,
    // Reset all reads, then grant ONLY the allow-list (kills the legacy
    // full-write grant web_user had on blogs).
    `REVOKE ALL ON ALL TABLES IN SCHEMA public FROM ${web};`,
    `REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM ${web};`,
    `REVOKE ALL ON ALL TABLES IN SCHEMA public FROM ${read};`,
    `REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM ${read};`,
    ...opts.tables.map(
      (t) => `GRANT SELECT ON public.${qid(t)} TO ${read};`
    ),
    // No default privileges: future tables stay unreadable by design. Clear any
    // a previous run may have set.
    `ALTER DEFAULT PRIVILEGES FOR ROLE ${cms} IN SCHEMA public REVOKE ALL ON TABLES FROM ${read};`,
    `ALTER DEFAULT PRIVILEGES FOR ROLE ${cms} IN SCHEMA public REVOKE ALL ON SEQUENCES FROM ${read};`,
    `ALTER DEFAULT PRIVILEGES FOR ROLE ${adm} IN SCHEMA public REVOKE ALL ON TABLES FROM ${read};`,
    `ALTER DEFAULT PRIVILEGES FOR ROLE ${adm} IN SCHEMA public REVOKE ALL ON SEQUENCES FROM ${read};`,
    // Admin manages all Strapi objects without role-switching.
    `GRANT ${cms} TO ${adm};`,
  ];

  // Best-effort cleanup: each wrapped in its own savepoint so a recoverable
  // error (e.g. grantor dependency) becomes a warning, not a full rollback.
  const cleanup = [
    {
      label: `remove admin from ${opts.webRole}`,
      sql: [`REVOKE ${web} FROM ${adm};`],
    },
    {
      // Removing admin from the read group can hit a grantor dependency
      // (web_user's membership was granted by the admin). Drop the dependent
      // membership first, remove the admin, then re-grant web_user.
      label: `remove admin from ${opts.readRole}`,
      sql: [
        `REVOKE ${read} FROM ${web};`,
        `REVOKE ${read} FROM ${adm};`,
        `GRANT ${read} TO ${web};`,
      ],
    },
  ];
  if (opts.dropRole) {
    cleanup.push({
      label: `drop stray role ${opts.dropRole}`,
      sql: [`DROP ROLE IF EXISTS ${qid(opts.dropRole)};`],
    });
  }
  return { critical, cleanup };
}

/* -------------------------------- Commands -------------------------------- */

async function ensurePasswords(client, opts) {
  // Set/rotate role passwords only when the env var is provided, or when the
  // role does not yet exist (then it's required).
  for (const [role, envKey] of [
    [opts.cmsRole, "CMS_DB_PASSWORD"],
    [opts.webRole, "WEB_DB_PASSWORD"],
  ]) {
    let pw = process.env[envKey] || "";
    const { rows } = await client.query(
      "SELECT 1 FROM pg_roles WHERE rolname=$1",
      [role]
    );
    const exists = rows.length > 0;
    if (!pw && !exists) {
      pw = await prompt(`Password for new role ${role}: `, { secret: true });
    }
    if (pw) {
      await client.query(`ALTER ROLE ${qid(role)} WITH LOGIN PASSWORD ${qlit(pw)}`);
    }
  }
}

async function runApply(client, opts, admin) {
  const { critical, cleanup } = buildApplyPlan(opts, admin);
  await client.query("BEGIN");
  try {
    await ensurePasswords(client, opts);
    for (const sql of critical) await client.query(sql);
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }

  // Cleanup steps: best-effort, each isolated so one failure can't undo others.
  for (const step of cleanup) {
    try {
      await client.query("BEGIN");
      for (const sql of step.sql) await client.query(sql);
      await client.query("COMMIT");
      console.log(`  ✓ ${step.label}`);
    } catch (err) {
      await client.query("ROLLBACK");
      console.warn(`  ⚠ skipped (${step.label}): ${err.message}`);
    }
  }
  console.log("==> apply complete.");
}

async function runStatus(client, opts, admin) {
  const tablesLit = opts.tables.length
    ? opts.tables.map((t) => qlit(t)).join(",")
    : "NULL";

  const q = async (label, sql, params = []) => {
    const { rows } = await client.query(sql, params);
    console.log(`\n== ${label} ==`);
    console.table(rows);
  };

  await q(
    "Roles",
    `SELECT rolname, rolcanlogin AS can_login, rolsuper AS superuser, rolinherit AS inherit
       FROM pg_roles WHERE rolname = ANY($1) ORDER BY rolname`,
    [[opts.cmsRole, opts.webRole, opts.readRole, admin]]
  );
  await q(
    "Role memberships",
    `SELECT m.rolname AS member, r.rolname AS member_of
       FROM pg_auth_members am
       JOIN pg_roles m ON m.oid = am.member
       JOIN pg_roles r ON r.oid = am.roleid
      WHERE r.rolname = ANY($1) OR m.rolname = ANY($2)
      ORDER BY member_of, member`,
    [
      [opts.cmsRole, opts.webRole, opts.readRole],
      [opts.cmsRole, opts.webRole, opts.readRole, admin],
    ]
  );
  await q(
    "Allow-list tables",
    `SELECT t AS allow_table FROM unnest(ARRAY[${tablesLit}]::text[]) AS t ORDER BY 1`
  );
  await q(
    "DRIFT: allow-list tables the group CANNOT read (under-granted)",
    `SELECT t AS tablename FROM unnest(ARRAY[${tablesLit}]::text[]) AS t
      WHERE EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename=t)
        AND NOT has_table_privilege($1, 'public.'||quote_ident(t), 'SELECT')
      ORDER BY 1`,
    [opts.readRole]
  );
  await q(
    "DRIFT: tables the group CAN read but are NOT allow-listed (over-granted)",
    `SELECT tablename FROM pg_tables
      WHERE schemaname='public'
        AND has_table_privilege($1, quote_ident(schemaname)||'.'||quote_ident(tablename), 'SELECT')
        AND tablename <> ALL(ARRAY[${tablesLit}]::text[])
      ORDER BY 1`,
    [opts.readRole]
  );
  await q(
    "DRIFT: direct grants held by web_user (should be EMPTY)",
    `SELECT table_name, string_agg(privilege_type, ', ' ORDER BY privilege_type) AS privs
       FROM information_schema.role_table_grants
      WHERE table_schema='public' AND grantee=$1
      GROUP BY table_name ORDER BY table_name`,
    [opts.webRole]
  );
  await q(
    "Default privileges in public (should be EMPTY for the group)",
    `SELECT pg_get_userbyid(d.defaclrole) AS for_role,
            d.defaclobjtype AS obj_type, d.defaclacl AS default_acl
       FROM pg_default_acl d JOIN pg_namespace n ON n.oid=d.defaclnamespace
      WHERE n.nspname='public' ORDER BY for_role, obj_type`
  );
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.dryRun) {
    const plan = buildApplyPlan(opts, "<admin>");
    console.log("-- DRY RUN: critical (transactional) statements --");
    for (const s of plan.critical) console.log(s);
    console.log("\n-- best-effort cleanup (each in its own savepoint) --");
    for (const step of plan.cleanup) {
      console.log(`-- ${step.label}`);
      for (const s of step.sql) console.log(s);
    }
    return;
  }

  const conn = await resolveConnection();
  const admin = conn.user;
  const client = new pg.Client(conn);
  await client.connect();
  try {
    if (opts.command === "bootstrap") {
      // The database itself is created out-of-band (or already exists); roles &
      // grants are converged here. Strapi creates the tables on first boot.
      await runApply(client, opts, admin);
      await runStatus(client, opts, admin);
    } else if (opts.command === "apply") {
      await runApply(client, opts, admin);
      await runStatus(client, opts, admin);
    } else {
      await runStatus(client, opts, admin);
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(`\nError: ${err.message}`);
  process.exit(1);
});
