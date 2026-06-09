import { metrics } from '@opentelemetry/api';
import type { InvocationContext } from '@azure/functions';

const meter = metrics.getMeter('sanskagarwal.heartbeat');

// One counter, dimensioned by endpoint + result, so alert queries can sum
// unhealthy checks per endpoint over a window.
const endpointCheckCounter = meter.createCounter('heartbeat.endpoint.checks', {
    description: 'Count of heartbeat endpoint checks, labelled by health result.',
});

type HealthResult = 'healthy' | 'unhealthy';

/**
 * Record the outcome of a single endpoint health check. Emits a custom metric
 * (queryable as AppMetrics in Application Insights) and a structured log line
 * (queryable as AppTraces) at the appropriate severity.
 */
export function recordEndpointHealth(
    context: InvocationContext,
    endpoint: string,
    healthy: boolean,
    details?: { status?: number; reason?: string }
): void {
    const result: HealthResult = healthy ? 'healthy' : 'unhealthy';

    endpointCheckCounter.add(1, {
        endpoint,
        result,
        status: details?.status ?? 0,
    });

    const payload = {
        endpoint,
        healthy,
        result,
        status: details?.status,
        reason: details?.reason,
    };

    if (healthy) {
        context.log(`heartbeat: ${endpoint} healthy`, payload);
    } else {
        context.error(`heartbeat: ${endpoint} unhealthy`, payload);
    }
}

