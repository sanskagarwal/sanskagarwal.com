import { app, InvocationContext, Timer } from "@azure/functions";
import axios, { HttpStatusCode } from "axios";

import { Constants } from "../constants";
import { trackEvent, trackException } from "../telemetry";

export async function heartbeat(
    myTimer: Timer,
    context: InvocationContext
): Promise<void> {
    const timeStamp = new Date().toISOString();
    if (myTimer.isPastDue) {
        context.log("Heartbeat function is running late!");
    }

    context.log("Heartbeat function ran!", timeStamp);

    // Dynamically get all URLs from Constants
    const urls = Object.entries(Constants);

    for (const [name, { url, expectedContent }] of urls) {
        context.log(`Checking ${name} (${url})...`);
        try {
            const res = await axios.get(url, {
                validateStatus: (status) => {
                    return status == HttpStatusCode.Ok;
                },
            });

            context.log(`${name} responded with status: ${res.status}`);

            // Validate response content
            if (res.data && res.data.includes(expectedContent)) {
                context.log(`${name} is healthy. Content validated.`);
                trackEvent(`${name}_Healthy`, { status: res.status });
            } else {
                throw new Error(`${name} returned unexpected content.`);
            }
        } catch (error) {
            handleError(context, error, name);
        }
    }
}

function handleError(context: InvocationContext, error: any, name: string) {
    if (error.response) {
        // The request was made and the server responded with a status code
        context.log(`${name} responded with status: ${error.response.status}`);
        context.log(error.response.data);
        context.log(error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        context.log(`${name} did not respond.`);
        context.log(error.request);
    } else {
        // Something happened in setting up the request
        context.log(`Error with ${name}: ${error.message}`);
    }

    trackException(new Error(`${name}: ${error.message}`));
}

app.timer("heartbeat", {
    schedule: "0 0 */1 * * *",
    handler: heartbeat,
});
