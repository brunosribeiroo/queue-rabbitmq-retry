const { questionCLI } = require("../cli/questionCLI");
const amqpConfig = require("../config/amqp-config");

async function consumer(msg, callback) {
    try {
        const message =  JSON.parse(msg.content.toString());
        let done = false;

        if (message.retry === true) done = false;
        if (message.retry === false) done = true;

        const result = callback(done);
        if (result === true || result === false || parseInt(result) >= amqpConfig.retry) {
            setTimeout(questionCLI, 1000);
        }
    } catch(e) {
        console.error(e);
        callback(false);
    }
}

module.exports = {
    consumer
}