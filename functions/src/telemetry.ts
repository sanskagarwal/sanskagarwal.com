import { metrics } from '@opentelemetry/api';
import type { InvocationContext } from '@azure/functions';

const meter = metrics.getMeter('sanskagarwal.heartbeat');

// One counter, dimensioned by endpoint + result, so alert queries can sum
// unhealthy checks per endpoint over a window.
const endpointCheckCounter = meter.createCounter('heartbeat.endpoint.checks', {
    description: 'Count of heartbeat endpoint checks, labelled by health result.',
});

// Latency of each probe so slow (but reachable) endpoints can be alerted on too.
const endpointLatency = meter.createHistogram('heartbeat.endpoint.latency', {
    description: 'Latency of heartbeat endpoint checks in milliseconds.',
    unit: 'ms',
});

export type FailureReason = 'timeout' | 'network' | 'status' | 'content';

export interface HealthOutcome {
    endpoint: string;
    healthy: boolean;
    severity: string;
    durationMs: number;
    status?: number;
    reason?: FailureReason;
    detail?: string;
}

/**
 * Record the outcome of a single endpoint health check. Emits a custom counter
 * and a latency histogram (queryable as AppMetrics in Application Insights) plus
 * a structured log line (queryable as AppTraces) at the appropriate severity.
 */
export function recordEndpointHealth(
    context: InvocationContext,
    outcome: HealthOutcome
): void {
    const { endpoint, healthy, severity, durationMs, status, reason, detail } = outcome;
    const result = healthy ? 'healthy' : 'unhealthy';

    endpointCheckCounter.add(1, {
        endpoint,
        result,
        severity,
        status: status ?? 0,
        reason: reason ?? 'none',
    });

    endpointLatency.record(durationMs, { endpoint, result });

    const payload = { endpoint, healthy, severity, durationMs, status, reason, detail };

    if (healthy) {
        context.log(`heartbeat: ${endpoint} healthy`, payload);
    } else {
        context.error(`heartbeat: ${endpoint} unhealthy`, payload);
    }
}


