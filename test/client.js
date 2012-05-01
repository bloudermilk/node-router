var http = require("http");

var PORT = process.env.PORT || 8080;

http.createServer(function (req, res) {

  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("Hello World\n");

  console.log("Served a request on 127.0.0.1:" + PORT);

}).listen(PORT, "127.0.0.1");

console.log("Test client running at 127.0.0.1:" + PORT);
