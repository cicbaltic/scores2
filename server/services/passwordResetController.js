// 'use strict';
function passwordReset(req, res) {
    var userService = require('./userService.js');
    if (req.body.email === undefined) {
        res.writeHead(400);
        res.end('Invalid email');
    } else {
        var email = req.body.email.toLowerCase();
        userService.checkUser(email, function(id) {
            if (id.length < 1) {
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.end('Invalid email');
            } else {
                userService.resetPassword(id[0].ID, function() {
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end('success');
                });
            }
        });
    }
}
module.exports = passwordReset;
