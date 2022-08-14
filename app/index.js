
const express = require('express');
const app = express();

const AMQPService = require('./service/AMQPService');
const amqpConfig = require('./config/amqp-config');
const messageConsumer = require('./consumer/messageConsumer');
const { questionCLI } = require('./cli/questionCLI');

app.listen(8080, () => {
    console.log("Server Queue RabbitMQ Retry Online!!!");
    console.log("Starting Service...");
});

setTimeout(questionCLI, 1500);

AMQPService.connect(() => {
    AMQPService.startPublisher();
    AMQPService.startConsumer(amqpConfig.queue, messageConsumer.consumer);
});
