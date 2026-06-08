import AxeBuilder from "@axe-core/playwright";
import { expect, Page, test } from "@playwright/test";

/** Routes that render without a content slug. */
const ROUTES = ["/", "/blog", "/resume", "/recipes", "/notes"] as const;

type Theme = "light" | "dark";

/**
 * Force a theme before any app script runs. The app's inline boot script reads
 * `localStorage.theme`, so seeding it guarantees the requested theme is applied
 * on first paint without a flash or a toggle click.
 */
async function gotoWithTheme(page: Page, path: string, theme: Theme) {
    await page.addInitScript((t) => {
        try {
            window.localStorage.setItem("theme", t as string);
        } catch {
            /* ignore */
        }
    }, theme);
    await page.goto(path, { waitUntil: "networkidle" });
    // Sanity check the theme actually applied.
    const isDark = await page.evaluate(() =>
        document.documentElement.classList.contains("dark")
    );
    expect(isDark, `expected ${theme} theme on ${path}`).toBe(theme === "dark");
}

async function analyze(page: Page) {
    return (
        new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
            // The Remark42 comments widget is third-party content injected via an
            // iframe; its markup is outside our control, so it is out of scope.
            .exclude("#remark42")
            .analyze()
    );
}

function assertNoViolations(
    results: Awaited<ReturnType<typeof analyze>>,
    context: string
) {
    const summary = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.map((n) => n.target.join(" ")),
    }));
    expect(results.violations, `${context}\n${JSON.stringify(summary, null, 2)}`).toEqual(
        []
    );
}

/** Find the href of the first content card on a listing page, if any. */
async function firstDetailHref(page: Page, listing: string, prefix: string) {
    await page.goto(listing, { waitUntil: "networkidle" });
    return page
        .locator(`a[href^="${prefix}"]`)
        .first()
        .getAttribute("href")
        .catch(() => null);
}

for (const theme of ["light", "dark"] as Theme[]) {
    test.describe(`a11y (${theme} mode)`, () => {
        for (const route of ROUTES) {
            test(`${route} has no detectable accessibility violations`, async ({
                page,
            }) => {
                await gotoWithTheme(page, route, theme);
                assertNoViolations(await analyze(page), `${theme} ${route}`);
            });
        }

        // Detail pages render user content (markdown, code blocks, tables);
        // discover a real slug from the listing so the check stays data-driven.
        for (const { listing, prefix } of [
            { listing: "/blog", prefix: "/blog/" },
            { listing: "/notes", prefix: "/notes/" },
        ]) {
            test(`${prefix}* detail page has no detectable accessibility violations`, async ({
                page,
            }) => {
                const href = await firstDetailHref(page, listing, prefix);
                test.skip(!href, `no content found under ${listing}`);
                await gotoWithTheme(page, href as string, theme);
                assertNoViolations(await analyze(page), `${theme} ${href}`);
            });
        }
    });
}
