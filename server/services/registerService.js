function registerMe (req, res) {
    console.log('starting resgister');
    var crypto = require('crypto');
    //var userPool = new require('./stubs/datBaseStubForJudges');
    //stub db
    var userStore = {'t@t':'1fd5e7ac81c6b14103c20f0572764d4af5aa5f22ffb9a39b9f9fae3309c3864erm4rDpFYYH'};

    var hashSalt, hash, salt;
    var hashSalt;
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 10; i++ )
        salt += possible.charAt(Math.floor(Math.random() * possible.length));
    var hash = crypto
        .createHash("sha256")
        .update(req.body.password + salt)
        .digest('hex');

    hashSalt = hash + salt;
    userStore[req.body.username] = hashSalt;
    console.log("created user: " + req.body.username + " pass: " + req.body.password + " hash: " + hashSalt);
    var usernameHash = crypto
        .createHash("sha1")
        .update(req.body.username)
        .digest('hex');
    console.log("usernameHash: " + usernameHash);
}

module.exports = registerMe;
