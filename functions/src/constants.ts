export type Severity = "critical" | "warning";

export interface EndpointCheck {
    /** Display name used as the telemetry dimension. */
    name: string;
    /** URL to probe. Prefer a lightweight health endpoint where available. */
    url: string;
    /** HTTP method; defaults to GET. */
    method?: "GET" | "HEAD";
    /** Expected HTTP status code; defaults to 200. */
    expectedStatus?: number;
    /** Optional substring the response body must contain. */
    expectedContent?: string;
    /** Alert severity if the check fails; defaults to "critical". */
    severity?: Severity;
}

export const HealthChecks: EndpointCheck[] = [
    {
        name: "MAIN",
        url: "https://sanskagarwal.com/api/health",
        expectedContent: "ok",
    },
    {
        // Tandoor has no dedicated health route; the root serves the login page.
        name: "COOK",
        url: "https://cook.sanskagarwal.com",
        expectedContent: "Tandoor",
    },
    {
        // Strapi health endpoint returns 204 No Content.
        name: "ADMIN",
        url: "https://admin.sanskagarwal.com/_health",
        method: "HEAD",
        expectedStatus: 204,
    },
    {
        // Immich ping endpoint returns {"res":"pong"}.
        name: "PHOTO",
        url: "https://photo.sanskagarwal.com/api/server/ping",
        expectedContent: "pong",
    },
    {
        // Remark42 ping endpoint returns "pong".
        name: "COMMENTO",
        url: "https://commento.sanskagarwal.com/api/v1/ping",
        expectedContent: "pong",
    },
    {
        // Jellyfin health endpoint returns "Healthy".
        name: "MEDIA",
        url: "https://media.sanskagarwal.com/health",
        expectedContent: "Healthy",
    },
    {
        // Open WebUI health endpoint returns {"status":true}.
        name: "AI",
        url: "https://ai.sanskagarwal.com/health",
        expectedContent: "status",
    },
];
