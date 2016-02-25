
var SENDGRID_APIKEY;
if (process.env.sendgridApiKey) {
    SENDGRID_APIKEY = process.env.sendgridApiKey;
} else {
    try {
        var enVars = require('fs').readFileSync('local_VCAP', 'utf8');
        var envObje = JSON.parse(enVars);
        SENDGRID_APIKEY = envObje.sendgridApiKey;
        console.log(SENDGRID_APIKEY);
    } catch (e) {
        console.log(e);
    }

}

var sendgrid  = require('sendgrid')(SENDGRID_APIKEY);

//Should get - email, username, password, role

module.exports = {
    emailSendingService: function(someInformation) {

        // console.log(someInformation);


        var emailTO = someInformation.emailTo;
        var emailJson = someInformation.emailJson;
        var emaiSubject = someInformation.emailSubject;

        var email = new sendgrid.Email();
        email.addTo(emailTO);
        email.subject = emaiSubject;
        email.from = 'noreply@appdirect.com';
        email.fromname = 'IBM SCORES app';
        email.html = '<h3> Hello ' + emailJson.name + ',</h3><br>' +
                    '<p>You are receiving this email because we want you to have access to IBM SCORES.</p><br>' +
                    '<p>Your credentials:</p>' +
                    '<p> Email (Username): ' + emailTO + '</p>' +
                    '<p> Password: ' + emailJson.pass + '</p><br>' +
                    '<p>Access IBM <b>SCORES</b>: <a href="http://ibmscores.mybluemix.net">http://ibmscores.mybluemix.net</a> </p><br>' +
                    '<p>Enjoy!</p><br>' +
                    '<p>IBM SCORES Team<p>' +
                    '<p>Support: <a href="mailto: antanas.kaziliunas@lt.ibm.com">antanas.kaziliunas@lt.ibm.com</a></p>';

        sendgrid.send(email , function(err, json) {
                if (err) { return console.error(err); }
            });
    }
};
