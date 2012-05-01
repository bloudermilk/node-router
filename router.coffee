# Packages
httpProxy = require "http-proxy"
redis     = require "redis"

# Config & Environment
PORT        = process.env.PORT or 8080
REDIS_PORT  = process.env.REDIS_PORT or "6379"
REDIS_HOST  = process.env.REDIS_HOST or "127.0.0.1"

# Database setup
redisClient = redis.createClient REDIS_PORT, REDIS_HOST

# Configure the http proxy
server = httpProxy.createServer (req, res, proxy) ->

  # Buffer the request so that `data` and `end` events are not lost during async
  # operation(s).
  buffer = httpProxy.buffer req

  # We use the HTTP "Host" header to route the request
  requestHost = req.headers.host

  # Routing keys in redis look like "Route:example.com"
  key = "Route:#{requestHost}"

  console.log "Looking up #{key}"

  # The redis command RPOPLPUSH acts as a round-robin for hosts with multiple
  # backends.
  redisClient.rpoplpush key, key, (err, route) ->
    if err?
      console.error "Database error for host #{requestHost}: #{err}"
      respond res, 500

    else if !route
      console.error "Requested host not found: #{requestHost}"
      respond res, 400

    else
      # Parse the host/port out of the route
      [host, port] = route.split ":"

      console.log "Routing #{requestHost} to #{host}:#{port}"

      # Proxy the response to the given client
      proxy.proxyRequest req, res,
        host:   host
        port:   port
        buffer: buffer

respond = (res, statusCode) ->
  res.writeHead statusCode
  res.end statusCode

server.listen(PORT)

console.log "Listening on port #{PORT}"
