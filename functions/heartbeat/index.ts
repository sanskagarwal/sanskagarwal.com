let appInsights = require("applicationinsights");
appInsights.setup().start();
let client = appInsights.defaultClient;

import { AzureFunction, Context } from "@azure/functions";
import axios, { HttpStatusCode } from "axios";

import { Constants } from "./constants";

const timerTrigger: AzureFunction = async function (
    context: Context,
    myTimer: any
): Promise<void> {
    var timeStamp = new Date().toISOString();
    if (myTimer.isPastDue) {
        context.log("Heartbeat function is running late!");
    }

    context.log("Heartbeat function ran!", timeStamp);
    context.log("Calling next server heartbeat");
    try {
        const res = await axios.get(Constants.HEARTBEAT_URI, {
            responseType: "json",
            validateStatus: (status) => {
                return status === HttpStatusCode.Ok;
            },
        });

        client.trackEvent({ name: "Heartbeat" });
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            context.log(error.response.data);
            context.log(error.response.status);
            context.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            context.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            context.log("Error", error.message);
        }

        client.trackException({ exception: new Error(error.message) });
    }
};

export default timerTrigger;
