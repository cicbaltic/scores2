var http = require('http');
var https = require('https');
var credService = require('./ossCredService');
var urlParser = require('url');
var fs = require('fs');

function ImageService() {
    console.log("Instancing ImageService\n");
    var self = this;

    var ossContainer = "images";

    self.getCredentials = function getCredentials(callback) {
        // if (self.credService === undefined) {
        //     self.credService = new CredService(callback);
        // } else {
        //     callback();
        // }
        callback();
    };

    self.interceptRestCall = function interceptRestCall(response, callback) {
        if (response.statusCode === 401) {
            credService.initialize(callback(response));
        } else if (response.statusCode === 404) {
            callback(response);
        } else {
            callback(response);
        }
    };

    self.putFileToRemote = function putFileToRemote(payload, url, headers, callback) {
        requestOptions = urlParser.parse(url);
        requestOptions.headers = headers;
        requestOptions.method = "PUT";

        var request = https.request(requestOptions, function(response) {
            self.interceptRestCall(response, function(response) {
                callback(response);
            });
        });
        request.end(payload);
    };

    self.putFile = function putFile(req, res) {
        //console.log(req.file);
        var filename = self.generateFileName(req.params.hackathonId, req.file.originalname);
        self.getCredentials(function() {});
        var payload = req.file.buffer;
        var url = '' +
            credService.getXStoreUrl() + "/" +
            ossContainer + "/" +
            filename;
        self.putFileToRemote(
            payload,
            url,
            {
                "X-Auth-Token": credService.getXToken(),
                "Content-Type": req.file.mimetype,
                "Content-Length": req.file.size
            },
            function(response) {
                var respTxt = JSON.stringify({filename: filename}, null, "  ");
                res.writeHead(response.statusCode, {
                    "Content-Type": "application/json;charset=utf-8",
                    "Content-Length": respTxt.length
                });
                res.end(respTxt);
            }
        );
    };
    /*  */
    self.getFile = function getFile(req, res) {
        var imgName = req.params["0"];
        self.getCredentials(function() {
            var url = credService.getXStoreUrl() + "/" + ossContainer + "/" + imgName;
            self.readFileToBuffer(
                url,
                { "X-Auth-Token": credService.getXToken() },
                function(data) {
                    res.writeHead(200, {"Content-Length": data.length});
                    res.end(data, 'binary');
                }
            );
        });
    };

    self.readFileToBuffer = function readFileToBuffer(url, headers, callback) {
        requestOptions = urlParser.parse(url);
        requestOptions.headers = headers;
        requestOptions.method = "GET";

        var localData;
        https.request(requestOptions, function(response) {
            self.interceptRestCall(response, function(response) {
                response.setEncoding('binary');
                response.on('data', function(data) {
                    if (localData === undefined) {
                        localData = new Buffer(data);
                    } else {
                        localData += data;
                    }
                });
                response.on('end', function() {
                    callback(localData);
                });
            });
        }).end();
    };

    // Java hashCode implementation
    self.generateFileName = function generateFileName(hackathonId, originalName) {
        var d = new Date();
        var str = hackathonId + originalName + d.getSeconds();
        var hash = 0;
        if (str.length === 0) {
            return hash;
        }
        for (i = 0; i < str.length; i++) {
            char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash | 0; // Convert to 32bit integer
        }
        return 'hack_' + hackathonId + '_logo_' + hash.toString(32);
    };

    self.createContainer = function createContainer(callback) {
        var token = credService.getXToken();
        var url = credService.getXStoreUrl() + "/" + ossContainer;

        requestOptions = urlParser.parse(url);
        requestOptions.headers = { "X-Auth-Token": token };
        requestOptions.method = "GET";

        https.request(requestOptions, function(response) {
            if (response.statusCode === 404) {
                var opts = urlParser.parse(url);
                opts.headers = { "X-Auth-Token": token };
                opts.method = "PUT";
                https.request(opts, function(res) {
                    console.log('created the container');
                }).end();
            }
        }).end();
    };

    self.deleteContainer = function deleteContainer(callback) {
        var token = credService.getXToken();
        var url = credService.getXStoreUrl() + "/" + ossContainer;

        requestOptions = urlParser.parse(url);
        requestOptions.headers = { "X-Auth-Token": token };
        requestOptions.method = "DELETE";

        https.request(requestOptions, function(response) {
            callback(response.statusCode);
        }).end();
    };

    self.getCredentials(function() {
        console.log("Getting Object-Storage credentials.\n");
    });
}
module.exports = exports = new ImageService();
