const { publish } = require('../service/AMQPService');
const amqpConfig = require('../config/amqp-config');

async function publisher(message){
    publish(amqpConfig.queue, JSON.stringify(message));
    return true;
}

module.exports = {
    publisher
}