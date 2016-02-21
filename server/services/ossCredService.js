var https = require('https');
var environment = require('./vcapService');
var urlParser = require('url');

function Credentials(initBack, initUrl) {
    var self = this;
    self.vcap = environment.getVCAP();
    self.ossIdentity;
    self.xToken;
    self.getXToken = function getXToken() {
        return self.xToken;
    };
    self.xStoreUrl;
    self.getXStoreUrl = function getXStoreUrl() {
        return self.xStoreUrl;
    };
    self.payloadForTokenGen = {
        auth: {
            identity: {
                methods: ["password"],
                password: {
                    user: {
                        id: self.vcap["Object-Storage"][0].credentials.userId,
                        password: self.vcap["Object-Storage"][0].credentials.password
                    }
                }
            },
            scope: {
                project: {
                    id: self.vcap["Object-Storage"][0].credentials.projectId
                }
            }
        }
    };
    self.urlForTokenGen = self.vcap["Object-Storage"][0].credentials.auth_url + "/v3/auth/tokens";

    self.setStorageToken = function getStorageToken(url, callback) {
        var txtPayload = JSON.stringify(self.payloadForTokenGen);
        requestOptions = urlParser.parse(url);
        requestOptions.headers = {
            'Content-Type': 'application/json',
            'Content-Length': txtPayload.length
        };
        requestOptions.method = "POST";
        //requestOptions.rejectUnauthorized = false;

        var httpsRequest = https.request(requestOptions, function(response) {
            self.xToken = response.headers["x-subject-token"];
            self.ossIdentity = new Buffer("");
            response.on('data', function(data) {self.ossIdentity += data; });
            response.on('end', function() {
                self.ossIdentity = JSON.parse(self.ossIdentity);
                self.setStorageUrl(callback);
            });
        });
        httpsRequest.write(txtPayload);
        httpsRequest.end();
    };

    self.setStorageUrl = function setStorageUrl(callback) {
        for (var i = 0; i < self.ossIdentity.token.catalog.length; i++) {
            if (self.ossIdentity.token.catalog[i].type === "object-store") {
                for (var j = 0; j < self.ossIdentity.token.catalog[i].endpoints.length; j++) {
                    if (self.ossIdentity.token.catalog[i].endpoints[j].interface === 'public' &&
                    self.ossIdentity.token.catalog[i].endpoints[j]['region_id'] === 'dallas') {
                        self.xStoreUrl = self.ossIdentity.token.catalog[i].endpoints[j].url;
                        if (callback !== undefined) {
                            callback();
                        }
                    }
                }
            }
        }
    };

    self.initialize = function initialize(callback, url) {
        if (url === undefined || url.length === 0) {
            self.setStorageToken(self.urlForTokenGen, callback);
        } else {
            self.setStorageToken(url, callback);
        }
    };

    self.initialize(initBack, initUrl);
}
module.exports = exports = new Credentials();
