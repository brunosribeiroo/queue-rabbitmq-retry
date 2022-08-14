const eventConsumer = require('../service/eventService');

async function consumer(msg, callback) {
  try {
    const event =  JSON.parse(msg.content.toString());
    let result = false;
    console.log(event);

    result = true; 
    callback(result);
  } catch(e) {
    console.error(e);
    callback(false);
  }
}

module.exports = {
  consumer
}