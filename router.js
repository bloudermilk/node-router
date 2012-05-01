(function() {
  var PORT, REDIS_HOST, REDIS_PORT, httpProxy, redis, redisClient, respond, server;

  httpProxy = require("http-proxy");

  redis = require("redis");

  PORT = process.env.PORT || 8080;

  REDIS_PORT = process.env.REDIS_PORT || "6379";

  REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";

  redisClient = redis.createClient(REDIS_PORT, REDIS_HOST);

  server = httpProxy.createServer(function(req, res, proxy) {
    var buffer, key, requestHost;
    buffer = httpProxy.buffer(req);
    requestHost = req.headers.host;
    key = "Route:" + requestHost;
    console.log("Looking up " + key);
    return redisClient.rpoplpush(key, key, function(err, route) {
      var host, port, _ref;
      if (err != null) {
        console.error("Database error for host " + requestHost + ": " + err);
        return respond(res, 500);
      } else if (!route) {
        console.error("Requested host not found: " + requestHost);
        return respond(res, 400);
      } else {
        _ref = route.split(":"), host = _ref[0], port = _ref[1];
        console.log("Routing " + requestHost + " to " + host + ":" + port);
        return proxy.proxyRequest(req, res, {
          host: host,
          port: port,
          buffer: buffer
        });
      }
    });
  });

  respond = function(res, statusCode) {
    res.writeHead(statusCode);
    return res.end(statusCode);
  };

  server.listen(PORT);

  console.log("Listening on port " + PORT);

}).call(this);
