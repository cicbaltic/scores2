//Info that should go to VCap
var templateID = '9c4b0568-2202-4969-a718-277317dad341';
var ourID = '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';

var sendgrid  = require('sendgrid')(ourID);

//Should get - email, username, password, role

module.exports = {
    emailSendingService: function(someInformation) {

        console.log(someInformation);


        var emailTO = someInformation.emailTo;
        var emailJson = someInformation.emailJson;
        var emaiSubject = someInformation.emailSubject;

        var email = new sendgrid.Email();
        email.addTo(emailTO);
        email.subject = emaiSubject;
        email.from = 'noreply@appdirect.com';
        email.html = '<h3> Hello ' + emailJson.name + ',</h3>' +
                    '<p>You are receiving this email because we want you to have access to IBM SCORES.</p>' +
                    '<p>Your credentials:</p>' +
                    '<p> Email (Username): ' + emailTO + '</p>' +
                    '<p> Password: ' + emailJson.pass + '</p><br>' +
                    '<p>Access IBM <b>SCORES</b>: <a href="http://ibmscores.mybluemix.net">http://ibmscores.mybluemix.net</a> </p>' +
                    '<p>Enjoy!</p>' +
                    '<p>IBM SCORES Team / Support: antanas.kaziliunas@lt.ibm.com</p>' +
                    '<p>IBM SCORES Team</p>' + '<p>Support: antanas.kaziliunas@lt.ibm.com</p>' +
                    '<p>Support: <a href="mailto: antanas.kaziliunas@lt.ibm.com">antanas.kaziliunas@lt.ibm.com</a></p>';

        // add filter settings one at a time
        email.addFilter('templates', 'enable', 1);
        email.addFilter('templates', 'template_id', templateID);

        sendgrid.send(email , function(err, json) {
                if (err) { return console.error(err); }
            });
    }
};
