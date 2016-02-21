function Server(headers, body) {
    var https = require('https');
    var fs = require('fs');

    var options = {
      key: fs.readFileSync('./test/mocha/services/https/key.pem'),
      cert: fs.readFileSync('./test/mocha/services/https/cert.pem'),
    };

    var testServer = https.createServer(options, function (req, res) {
      res.writeHead(200, headers);
      res.end(body);
    }).listen(8000);
    var testServerUrl = "https://localhost:8000/";

    this.kill = function kill() {
        testServer.close();
    }
}

module.exports = Server;
