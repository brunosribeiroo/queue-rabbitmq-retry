const amqpConfig = {
    uri: "amqp://0.0.0.0:5672",
    exchange: "ex_event",
    routing_key: "rk_event",
    exchange_ttl: "ex_event_ttl",
    exchange_dlx: "ex_event_dlx",
    queue: "event",
    queue_retry: "event_retry",
    ttl: 3000,
    retry: 4,
    user: "rabbitmq",
    pass: "rabbitmq",
}

module.exports = amqpConfig;