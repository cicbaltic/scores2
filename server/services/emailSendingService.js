//9c4b0568-2202-4969-a718-277317dad341
//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
var sendgrid  = require('sendgrid')("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");

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
    email.addFilter('templates', 'template_id', '9c4b0568-2202-4969-a718-277317dad341');

    /*
    // or set a filter using an object literal.
    email.setFilters({
        templates: {
            settings: {
                enable: 1,
                template_id: '9c4b0568-2202-4969-a718-277317dad341',
            }
        }
    });
    */

    sendgrid.send(email , function(err, json) {
            if (err) { return console.error(err); }
            console.log(json);
        });
    res.end('OK');
}
module.exports = emailService;
