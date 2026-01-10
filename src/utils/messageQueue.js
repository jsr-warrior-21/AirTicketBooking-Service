const amqplib = require("amqplib");

const {MESSAGE_BROKER_URL,EXCHANGE_NAME} = require('../config/serverConfig');

// read documantation of the RabitMQ website and learn each defination


const createChannel = async () => {
  try {
    // setting up channel
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();
    // assert exchange - see in documentation
    await channel.assertExchange(EXCHANGE_NAME, "direct", false); // also help in dirstrubution in message.
    return channel;
  } catch (error) {
    throw error; 
  }
};

// subscribing to the message

const subscribeMessage = async (channel, service, binding_key) => {
  const applicationonQueue = await channel.assertQueue('QUEUE_NAME');

  channel.bindQueue(applicationonQueue.queue, EXCHANGE_NAME, binding_key);
  channel.consume(applicationonQueue.queue, (msg) => {
    console.log("recieved data");
    console.log(msg.content.toString());
    channel.ack(msg);
  });
};

// publishing the message

const publishMessage = async (channel, binding_key, message) => {
  try {
    const applicationonQueue = await channel.assertQueue(QUEUE_NAME);
    await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
  } catch (error) {
    throw error;
  }
};

module.exports = { createChannel, subscribeMessage, publishMessage };
