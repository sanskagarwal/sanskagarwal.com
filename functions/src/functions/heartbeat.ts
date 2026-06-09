import { app, InvocationContext, Timer } from "@azure/functions";

import { Constants } from "../constants";
import { recordEndpointHealth } from "../telemetry";

// Per-request timeout for endpoint probes.
const REQUEST_TIMEOUT_MS = 10_000;

export async function heartbeat(
    myTimer: Timer,
    context: InvocationContext
): Promise<void> {
    if (myTimer.isPastDue) {
        context.warn("Heartbeat function is running late!");
    }

    context.log("Heartbeat function ran!", new Date().toISOString());

    await Promise.all(
        Object.entries(Constants).map(([name, check]) =>
            checkEndpoint(context, name, check.url, check.expectedContent)
        )
    );
}

async function checkEndpoint(
    context: InvocationContext,
    name: string,
    url: string,
    expectedContent: string
): Promise<void> {
    context.log(`Checking ${name} (${url})...`);

    try {
        const res = await fetch(url, {
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
            redirect: "follow",
        });

        if (!res.ok) {
            recordEndpointHealth(context, name, false, {
                status: res.status,
                reason: `Unexpected status ${res.status}`,
            });
            return;
        }

        const body = await res.text();
        if (body.includes(expectedContent)) {
            recordEndpointHealth(context, name, true, { status: res.status });
        } else {
            recordEndpointHealth(context, name, false, {
                status: res.status,
                reason: "Response did not contain expected content",
            });
        }
    } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        recordEndpointHealth(context, name, false, { reason });
    }
}

app.timer("heartbeat", {
    schedule: "0 0 */1 * * *",
    handler: heartbeat,
});
