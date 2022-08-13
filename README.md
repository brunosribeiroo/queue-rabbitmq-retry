# Queue RabbitMQ Retry
## Example in NodeJS of queue (**Publisher** and **Consumer**) with RabbitMQ using retry strategy.
---

## Requirements
- <code><img height="15" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png"></code> NodeJS
- <code><img height="15" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/docker/docker.png"></code> Docker and Docker-Compose

## Installation
```bash
cd app \
&& npm install \
&& docker build -t app/app . \
&& cd .. \
&& cd queue \
&& docker build -t app/queue . \
&& cd .. \
&& docker-compose up -d
```
