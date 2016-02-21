var https = require('https');

module.exports = {

    randomPaswordGen: function(callback) {
        var options = {
            host: 'en.wikipedia.org',
            path: '/wiki/Special:Random',
            method: 'GET',
        };
        var password = '';
        var string = '';
        var numExp = new RegExp(/[^a-zA-Z]/);

        function passGen(callback) {
            var req = https.request(options, function(res) {
                string = res.headers.location.split('/').pop().split('_')[0];
                if (4 <= string.length &&
                    string.length <= 6 &&
                    !numExp.test(string)) {
                    password += string;
                }
                if (password.length <= 8) {
                    passGen();
                } else {
                    responder (password);
                }
            });
            req.end();
        }
        passGen();
        function responder(pass) {
            callback(pass);
            return;
        }
    }
};
