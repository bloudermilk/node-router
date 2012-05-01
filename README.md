# Node Router

This is a prototype HTTP router written in Node JS. Its functionality was
inspired by Heroku-style host routing. It utilizes Redis to coordinate
round-robin load balancing among multiple routers.

## Installation

All node dependencies are available via npm:

```bash
$ git clone git://github.com/bloudermilk/node-router.git
$ npm install
```

You'll also need a redis server.

## Try it out

Starting the server is as easy as:

```bash
$ npm start
```

There are three environment variables you can use to configure the router:

`PORT`: The port to bind the proxy to (default: 8080)
`REDIS_HOST`: The host of the redis server to connect to (default: 6379)
`REDIS_PORT`: The port of the redis server to connect to (default: 127.0.0.1)

You could use them like so:
```
$ PORT=80 REDIS_PORT=6666 npm start
```

Once your have the router running, seed the DB like so:

```bash
$ redis-cli
redis 127.0.0.1:6379> RPUSH Route:127.0.0.1:8080 127.0.0.1:8090
(integer) 1
redis 127.0.0.1:6379> RPUSH Route:127.0.0.1:8080 127.0.0.1:8091
(integer) 2
```

This configures the router to take all requests to port `8080` on `localhost`
and route them to ports `8090` and `8091`.

## Testing

I included a "hello world" node app to test the functionality. You can run as
many as you would like behind the router like so:

```bash
$ PORT=8090 node test/client.js
```

## Tips

The `node-redis` library will automatically take advantage of the native
`hiredis` package if you have it installed. This can result in massive speed
improvements over the pure javascript library. Install it with npm:

```bash
$ npm install hiredis
```
