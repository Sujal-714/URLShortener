import client from 'prom-client'

export const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const httpDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.01,0.05,0.1,0.3,0.5,1,2,5],
});

register.registerMetric(httpDuration);