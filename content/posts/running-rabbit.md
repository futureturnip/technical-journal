---
title: "Running Rabbit"
date: 2018-01-23T11:13:19-05:00
draft: false
---

Run the container

`docker run -d --name go-rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management`

I named the container "go-rabbit" in this example. As soon as the container has been created you can run the container again:

`docker start go-rabbit`

Connect to the management console on `http://localhost:15672` and connect to amqp on port `5672`.

