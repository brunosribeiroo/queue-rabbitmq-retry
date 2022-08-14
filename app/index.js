const readline = require('readline');
const express = require('express');
const app = express();

const AMQPService = require('./service/AMQPService');
const amqpConfig = require('./config/amqp-config');
const eventConsumer = require('./consumer/eventConsumer');

app.listen(8080, () => {
  console.log("Server Queue RabbitMQ Retry Online!!!");
  console.log("Starting Service...");
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const questionCLI = () => {
  rl.question(`
Enter the option to post in the queue...
1) No Retry Strategy
2) With Retry Strategy
  `, (name) => {
    switch (name) {
      case '1':
        console.log('olaa1');
        questionCLI();
        break;
      
      case '2':
        console.log('olaa2');
        questionCLI();
        break;

      default:
        console.log('Sorry, invalid option.');
        questionCLI();
    }
  });
}

setTimeout(questionCLI, 1500);

AMQPService.connect(() => {
  AMQPService.startPublisher();
  AMQPService.startConsumer(amqpConfig.queue, eventConsumer.consumer);
});