# Queue RabbitMQ Retry
### Example in NodeJS of queue (**Publisher** and **Consumer**) with RabbitMQ using retry strategy.
---

## Requirements
- <code><img height="25" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png"></code> NodeJS
- <code><img height="25" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/docker/docker.png"></code> Docker

## Installation
```bash
cd queue \
&& docker build -t app/queue . \
&& docker run --name queue_rabbitmq -it -d -p 5673:5672 -p 15672:15672 app/queue \
&& cd .. \
&& cd app \
&& npm install \
&& npm run dev
```

**Keep the terminal open**

## Access RabbitMQ
[http://localhost:15672](http://localhost:15672)

### Use
**Interaction is make by terminal**

### Use cases
- Option 1) Publisher the message to the queue without retry estrategy;
- Option 2) Publisher the message to the queue with retry estrategy;