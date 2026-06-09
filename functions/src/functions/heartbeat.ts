import { app, InvocationContext, Timer } from "@azure/functions";

import { HealthChecks, EndpointCheck } from "../constants";
import { recordEndpointHealth, FailureReason } from "../telemetry";

// Per-request timeout for endpoint probes.
const REQUEST_TIMEOUT_MS = 10_000;

// error.name set by AbortSignal.timeout() when the request exceeds REQUEST_TIMEOUT_MS.
const TIMEOUT_ERROR_NAME = "TimeoutError";

export async function heartbeat(
    myTimer: Timer,
    context: InvocationContext
): Promise<void> {
    if (myTimer.isPastDue) {
        context.warn("Heartbeat function is running late!");
    }

    context.log("Heartbeat function ran!", new Date().toISOString());

    await Promise.all(HealthChecks.map((check) => runCheck(context, check)));
}

async function runCheck(
    context: InvocationContext,
    check: EndpointCheck
): Promise<void> {
    const { name, url } = check;
    const method = check.method ?? "GET";
    const expectedStatus = check.expectedStatus ?? 200;
    const severity = check.severity ?? "critical";
    const start = performance.now();

    context.log(`Checking ${name} (${method} ${url})...`);

    try {
        const res = await fetch(url, {
            method,
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
            redirect: "follow",
        });
        const durationMs = Math.round(performance.now() - start);

        if (res.status !== expectedStatus) {
            recordEndpointHealth(context, {
                endpoint: name,
                healthy: false,
                severity,
                durationMs,
                status: res.status,
                reason: "status",
                detail: `Expected ${expectedStatus}, got ${res.status}`,
            });
            return;
        }

        if (check.expectedContent && method !== "HEAD") {
            const body = await res.text();
            if (!body.includes(check.expectedContent)) {
                recordEndpointHealth(context, {
                    endpoint: name,
                    healthy: false,
                    severity,
                    durationMs,
                    status: res.status,
                    reason: "content",
                    detail: "Response did not contain expected content",
                });
                return;
            }
        }

        recordEndpointHealth(context, {
            endpoint: name,
            healthy: true,
            severity,
            durationMs,
            status: res.status,
        });
    } catch (error) {
        const durationMs = Math.round(performance.now() - start);
        const reason: FailureReason =
            error instanceof Error && error.name === TIMEOUT_ERROR_NAME
                ? "timeout"
                : "network";
        const detail = error instanceof Error ? error.message : String(error);

        recordEndpointHealth(context, {
            endpoint: name,
            healthy: false,
            severity,
            durationMs,
            reason,
            detail,
        });
    }
}

app.timer("heartbeat", {
    schedule: "0 0 */1 * * *",
    handler: heartbeat,
});
