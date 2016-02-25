
var sendgrid  = require('sendgrid')("");

function emailService(req, res) {

    //hackatester@gmail.com
    var information = req.body.information;
    var emailTO = information.emailTo;
    var emailJson = information.emailJson;
    var emaiSubject = information.emailSubject;
    console.log(emailTO);
    console.log(emailJson);
    console.log(emaiSubject);

    var email = new sendgrid.Email();
    email.addTo(emailTO);
    email.subject = emaiSubject;
    email.from = 'noreply@appdirect.com';
    email.html = '<h3>Your username and password</h3>' + '<p> Username: ' + emailJson.user + '</p>' + '<p> Password: ' + emailJson.pass + '</p>';

    // add filter settings one at a time
    email.addFilter('templates', 'enable', 1);
    email.addFilter('templates', 'template_id', '');

    sendgrid.send(email , function(err, json) {
            if (err) { return console.error(err); }
            console.log(json);
        });
    res.end('OK');
}
module.exports = emailService;
