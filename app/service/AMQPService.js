var amqp = require('amqplib/callback_api');
const config = require('../config/amqp-config');

let amqpConn = null;
let pubChannel = null;

function startPublisher() {
  amqpConn.createConfirmChannel(function (err, ch) {
    if (closeOnErr(err)) return;

    ch.on("error", function (err) {
      console.error("[AMQP] Channel Error", err.message);
    });

    ch.on("close", function () {
      console.log("[AMQP] Channel Closed");
    });

    pubChannel = ch;
    console.log("[AMQP] Initiated Publisher");
  });
}

function publish(queue, content, options = {}) {
  if (!pubChannel) {
    console.error("Publishing Channel Not Started");
    return;
  }
  const message = Buffer.from(content, "utf-8");
  try {
    // Preparing message redirection arguments in case of reject (nack)
    let queueOptions = {
      durable: true,
      arguments: {
        "x-dead-letter-exchange": `dle_ex_${queue}`,
        "x-dead-letter-routing-key": `dle_rk_${queue}`
      }
    };

    // Create the exchange if it doesn't exist
    pubChannel.assertExchange(`ex_${queue}`, 'direct', { durable: true });
    
    // Create the main queue if it doesn't exist
    pubChannel.assertQueue(queue, queueOptions, (error, success) => {
      if (success) {
        // Bind the main queue to the main exchange
        pubChannel.bindQueue(
          queue,
          `ex_${queue}`,
          `rk_${queue}`
        );
      }

      // Publish the message
      pubChannel.publish(`ex_${queue}`, `rk_${queue}`, message, options,
        (err) => {
          if (err) {
            console.error(`[AMQP] Error posting message ${message}`, err);
            pubChannel.connection.close();
            return;
          }
          console.log("[AMQP] Post published");
        });
    });
  } catch (e) {
    console.error(`[AMQP] Error posting message ${message}`, e);
  }
}

function connect(fnFinish) {
  const opt = { credentials: require('amqplib').credentials.plain(config.user, config.pass) };

  amqp.connect(config.uri, opt, (err, conn) => {

    if (err) {
      console.error("[AMQP] Error connecting", err.message);
      return setTimeout(() => { module.exports.connect(fnFinish) }, 1000);
    }

    conn.on("error", function (err) {
      console.log("ERROR", err);
      if (err.message !== "Connection closing") {
        console.error("[AMQP] Error connecting", err.message);
      }
    });

    conn.on("close", function () {
      console.error("[AMQP] Connection lost, reconnecting");
      return setTimeout(() => { module.exports.connect(fnFinish) }, 1000);
    });

    console.log("[AMQP] Connected");
    amqpConn = conn;
    fnFinish();
  });
}

function startConsumer(queue, fnConsumer) {

  amqpConn.createChannel(function (err, ch) {
    if (closeOnErr(err)) return;

    ch.on("error", function (err) {
      console.error("[AMQP] Error creating channel", err.message);
    });

    ch.on("close", function () {
      console.log("[AMQP] Channel closed");
    });

    // Dead-Letter parameters for message redirection after spending its time in dead-letter
    let queueDeadLetterOptions = {
      durable: true,
      arguments: {
        "x-dead-letter-exchange": `ex_${queue}`,
        "x-dead-letter-routing-key": `rk_${queue}`,
        "x-queue-type": "classic",
        "x-message-ttl": 15000
      }
    };

    // Create dead-letter exchange
    ch.assertExchange(`dle_ex_${queue}`, 'direct', { durable: true });

    // Create dead-letter queue
    ch.assertQueue(`dle_${queue}`, queueDeadLetterOptions, (error, success) => {
      if (success) {
        ch.bindQueue(`dle_${queue}`, `dle_ex_${queue}`, `dle_rk_${queue}`);
      }
    });

    ch.prefetch(10);

    let queueOptions = {
      durable: true,
      arguments: {
        "x-dead-letter-exchange": `dle_ex_${queue}`,
        "x-dead-letter-routing-key": `dle_rk_${queue}`
      }
    };

     // Create the exchange if it doesn't exist
     ch.assertExchange(`ex_${queue}`, 'direct', { durable: true });

    // Create the main queue if it doesn't exist
    ch.assertQueue(queue, queueOptions, function (err, _ok) {
      if (closeOnErr(err)) return;

      // Bind the main queue to the main exchange
      ch.bindQueue(
        queue,
        `ex_${queue}`,
        `rk_${queue}`
      );

      ch.consume(queue, processMsg, { noAck: false });
      console.log(`[AMQP] ${fnConsumer.name} OK`);
    });

    function processMsg(msg) {
      fnConsumer(msg, function (ok) {
        try {
          if (ok) {
            ch.ack(msg);
          } else {
            if (msg.properties == undefined || msg.properties.headers == undefined || !msg.properties.headers["x-death"]) {
              console.log("[listener][0] Error consuming message, message directed to retry");
              ch.nack(msg, false, false);
            }
            else {
              let counter = msg.properties.headers["x-death"][0].count;
              console.log("[listener]["+counter+"] Error consuming message, message directed to retry");
              if (counter >= config.retry)
              {
                  console.log("[listener] Event consumption retry limit reached");
                  ch.ack(msg);
              }
              else
              {
                  ch.nack(msg, false, false);
              }
          }
          }

        } catch (e) {
          closeOnErr(e);
        }
      });
    }
  });
}

module.exports = {
  connect,
  startPublisher,
  publish,
  startConsumer
};

function closeOnErr(err) {
  if (!err) return false;
  console.error("[AMQP] error", err);
  amqpConn.close();
  return true;
}