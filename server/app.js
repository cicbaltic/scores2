// /*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

var agent = require('bluemix-autoscaling-agent');

process.on('uncaughtException', function (error) {
    if (error) {
        console.error("Error type: uncaughtException");
        if (error.name) {
            console.error("Error name:", error.name);
        }
        if (error.message) {
            console.error("Error message:", error.message);
        }
        if (error.stack) {
            console.error("Error stack:", error.stack);
        }
    } else {
        console.error("Error: uncaughtException");
    }
});

console.log(JSON.stringify(process.argv, null, ' '));
if (process.argv[2]) {
    //console.log(process.argv);
    require('../buildDb.js');
}

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

console.log(cfenv);

// create a new express server
var app = express();

// enforce SSL usage
app.use(function(req, res, next) {
    if (req.headers && req.headers.$wssp === "80") {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
});

// serve the files out of ./public as our main files
app.use(express.static('public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// for logging
var morgan = require('morgan');
app.use(morgan('dev'));

// SERVER SIDE SERVICES
// setting up local services
//var LoginService = require('./services/loginService');
//var ImageService = require('./services/imageService');
var HackathonService = require('./services/hackathonController');
var CriteriaService = require('./services/criteriaController');
var JudgeService = require('./services/judgeService');
var TeamService = require('./services/teamController');
var AutocompleteService = require('./services/autocompleteService');
var UserService = require('./services/userController');
var ScoreService = require('./services/scoreController');
var services = {
    /*
    judgeService: new require('./services/judgeService'),
    organizersService: new require('./services/organisersService'),
    loginService: new require('./services/loginService'),
    registerService: new require('./services/registerService'),
    imgService: new ImageService(),
    loginEvaluation: new require('./services/loginEvaluation'),
    emailService: new require('./services/emailSend'),
    teamService: new require('./services/teamService'),
    criteriaService: new require('./services/criteriaService'),
    adminPanelRespondService: new require('./services/adminPanelRespondService'),
    adminPanelService: new require('./services/adminPanelService'),
    teamInfoService: new require('./services/teamInfoService'),
    scoreService: new require('./services/scoreService')
    //loginService: new LoginService()
    */
    scoreService: new ScoreService(),
    //scoreService: require('./services/scoreService'),
    judgeService: new JudgeService(),
    organizersService: require('./services/organisersService'),
    loginService: require('./services/loginService'),
    registerService: require('./services/registerService'),
    imgService: require('./services/imageService'),
    loginEvaluation: require('./services/loginEvaluation'),
    emailService: require('./services/emailSendingService'),
    teamService: new TeamService(),
    criteriaService: new CriteriaService(),
    adminPanelRespondService: require('./services/adminPanelRespondService'),
    adminPanelService: require('./services/adminPanelService'),
    // teamInfoService: require('./services/teamInfoService'),
    hackathonService: new HackathonService(),
    emailSendingService: require('./services/emailSender'),
    autocompleteService: new AutocompleteService(),
    userService: new UserService(),
    mentorService: require('./services/mentorController'),
    tokenService: require('./services/tokenController'),
    passwordResetController: require('./services/passwordResetController'),
    reportService: require('./services/reportService'),
    captchaService: require('./services/captchaService')
};

// Secret variable for tokengen
var jwtKey;
if (process.env.jwtKey) {
    jwtKey = process.env.jwtKey;
} else {
    try {
        var enVars = require('fs').readFileSync('local_VCAP', 'utf8');
        var envObje = JSON.parse(enVars);
        if(envObje.jwtKey){
            jwtKey = envObje.jwtKey;
        }else{
            throw 'jwtKey is undefined';
        }

    } catch (e) {
        jwtKey = require('./services/helpers/rndString')(256);
    }

}
jwtKey = "9F6b6T0X00dF3RMi27BNC6WNn4o4CAt49zJQaORBltA57MVy4DeahACsOPVj67f206oW2RXqO0DFR8sG12t1kI06d39hHv1d9Bh11ucxsoTYR720j1b0Xd62b8y1iHCVu9Ak16frEfcIq00wKCl3afF8z6pZ2Hp1VXzksrgNr6Gvo7502D6rpsYi7w1B9uwcOP9EU68M5H2x99mx9N1lPbmztVJSlA94ZSXt4A7dqJJg9g7b754D39c4WkY9P5b9";
app.set('tokenSecret', jwtKey);

// setting up the Routes
var Routes = require('./routes.js');
var routes = new Routes(app, services);
console.log(process.versions);
console.log("Attempting to start the server...");
// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});
//var loginService = new require('./services/loginService')(app);

exports.port = appEnv.port;
exports.tokenSecret = app.get('tokenSecret');
