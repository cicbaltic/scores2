var cfenv = require("cfenv");

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

//get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();
var URL = appEnv.url;
var EMAIL = process.env.supportEmail || "support@ibm.com";

console.log("EMAIL: " + EMAIL);

//Should get - email, username, password, role

module.exports = {
    emailSendingService: function(someInformation) {

        // console.log("APP_ENV: " + JSON.stringify(appEnv));


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
                    '<p>Access IBM <b>SCORES</b>: <a href="' + URL + '">' + URL + '</a> </p><br>' +
                    '<p>Enjoy!</p><br>' +
                    '<p>IBM SCORES Team<p>' +
                    '<p>Support: <a href="mailto: ' + EMAIL + '">' + EMAIL + '</a></p>';

        sendgrid.send(email , function(err, json) {
                if (err) { return console.error(err); }
            });
    },

    informAboutNewRole: function(someInformation) {
        
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
                            '<p>You are receiving this email because you were added to event <b>"' + emailJson.eventName + '"</b> as ' + emailJson.role + '</p><br>' +
                            // '<p>Your credentials:</p>' +
                            // '<p> Email (Username): ' + emailTO + '</p>' +
                            // '<p> Password: ' + emailJson.pass + '</p><br>' +
                            '<p>Access IBM <b>SCORES</b>: <a href="' + URL + '">' + URL + '</a> </p><br>' +
                            '<p>Enjoy!</p><br>' +
                            '<p>IBM SCORES Team<p>' +
                            '<p>Support: <a href="mailto: ' + EMAIL + '">' + EMAIL + '</a></p>';
        
                sendgrid.send(email , function(err, json) {
                        if (err) { return console.error(err); }
                    });
            }
};
