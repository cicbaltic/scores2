/* jshint node:true, es5:true */
'use strict';

var util = require('util');
var bodyParser = require('body-parser');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({storage: storage});
var auth = require('./services/authorizationService');

function Routes(app, services) {
    app.use(bodyParser.json());
    // app.use(function(req, res, next) {
    //     console.log(JSON.stringify((req.headers), null, ' '));
    //     next();
    // });
    // app.use(auth.intercept);
    app.all('/authenticate', services.loginEvaluation);
    app.all('/organisers', services.adminPanelService);
    //app.get('/judges', services.judgeService);
    //app.post('/scores', services.scoreService);
    //app.get('/organisersInfo', services.organizersService);
    app.post('/registerMe', services.registerService);
    app.post('/authenticate', services.loginService);
    app.post('/images/:hackathonId', auth.hasAccess(2), upload.single('image'), services.imgService.putFile);
    app.get(/\/images\/(.*)/, services.imgService.getFile);
    app.post('/sendMail', services.emailService);
    app.post('/api/passwordReset', services.passwordResetController);
    app.get('/api/reportService/:hackathonId', auth.hasAccess(2), services.reportService);
    //app.get('/teamlist', services.teamService);
    //app.get('/criteriaInfoGetter', services.criteriaService);

    /*
    // Retrieves current scores for a hackthon
    app.get('/api/hackathon/scores/:hackathonId', ...);
    // Retrieves current scores per team, per criteria for a given judge (ID passed through header)
    app.get('/api/scores/judge/:hackahtonId', ...); (depends on header payload?)
    // Posts/edits scores per team, per criteria by a judge (ID passed through header)
    app.post('/api/scores/judge/:hackathonId', ...) (depends on header payload?)

    // Retrieves organisers for a hackathon
    app.get('/api/hackathon/organizers/:hackathonId', ...);
    // Assigns an organizer to a hackathon (organizer and hackathon IDs within payload)
    app.post('/api/organizer/assign');
    */

    //return captcha
    app.get('/api/getcaptcha', services.captchaService);

    // Retrievs the user token, TAKES username and password in the headers.
    app.get('/api/gettoken', services.tokenService.getToken);

    // Checks token.
    app.get('/api/checktoken', services.tokenService.checkToken);

    // gets user roles
    app.get('/api/getroles', services.tokenService.getUserRoles);

    app.post('/organisers', services.adminPanelRespondService);
    // app.get('/team', services.teamInfoService);
    // Retrieves a list of all hackathons
    app.get('/api/hackathons', services.hackathonService.getHackathonList);
    // Creates new hackathon
    app.post('/api/hackathon/new', auth.hasAccess(1), services.hackathonService.createNewHackathon);
    // Retrieves hackathon general info
    app.get('/api/hackathon/info/:hackathonId', services.hackathonService.getHackathonInfo);
    // Edits hackathon general info
    app.post('/api/hackathon/info/:hackathonId', auth.hasAccess(2), services.hackathonService.editHackathonInfo);
    // Retrieves criterias currently associated with a hackathon
    app.get('/api/hackathon/criteria/:hackathonId', services.hackathonService.getHackathonCriteria);
    // Assigns an EXISTING criteria (ID in payload) to a hackathons
    app.post('/api/hackathon/criteria/:hackathonId', auth.hasAccess(2), services.criteriaService.assignHackathonCriteria);
    // Retrieves judges currently assigned to a hackathon
    app.get('/api/hackathon/judges/:hackathonId', services.judgeService.getHackathonJudges);
    // Retrieves teams currently assigned to a hackathon
    app.get('/api/hackathon/teams/:hackathonId', services.hackathonService.getHackathonTeams);
    // Retrieves mentors currently assigned to a hackathon
    app.get('/api/hackathon/mentors/:hackathonId', services.hackathonService.getHackathonMentors);
    // Reterieves organizers currently assigned to a hackthon
    app.get('/api/hackathon/organizers/:hackathonId', services.hackathonService.getHackathonOrganizers);
    // Creates a new criteria and assigns it to a hackathon (ID in payload) immediately
    app.post('/api/criteria/new', auth.hasAccess(2), services.criteriaService.newCriteriaCreate);
    // Assigns and EXISTING criteria to a hackathon
    //app.post('/api/criteria/assign', services.criteriaService.createNewCriteria);
    // Retrieves basic info on a criteria regardless of assignment
    app.get('/api/criteria/info/:criteriaId', services.criteriaService.getCriteria);
    // Updates basic info of a criteria regardless of assignment
    app.post('/api/criteria/info/:criteriaId', auth.hasAccess(2), services.criteriaService.editCriteria);

    // Searches db for users
    app.get('/api/autocomplete/user/:hackathonId', services.autocompleteService.searchUsers); //auth.hasAccess(2), 

    // Assigns an existing jury to a hackathon
    app.post('/api/judge/assign', auth.hasAccess(2), services.judgeService.assignJudge);
    // Get user Access by email
    app.post('/api/judge/access', services.judgeService.getJudgeAccessByEmail); // auth.hasAccess(2),

    // Updates existing user information
    app.post('/api/user/info', auth.hasAccess(2), services.userService.updateUserInfo);
    // Creates a new user
    app.post('/api/user/register', auth.hasAccess(2), services.userService.registerNewUser);
    ///Inform by email about new role'
    app.post('/api/user/informemail', services.userService.informAboutNewRole); //auth.hasAccess(2), 
    
    // Create new team
    app.post('/api/team/new', auth.hasAccess(2), services.teamService.newTeamCreate);
    // Assign new team to a HACKATHON
    app.post('/api/team/assign', auth.hasAccess(2), services.teamService.assignTeam);
    // Update team information
    app.post('/api/team/info/:teamID', auth.hasAccess(2), services.teamService.updateTeamInfo);
    // Retrieves the summary of scores for given hackathon
    app.get('/api/hackathon/scores/:hackathonId', services.scoreService.getMainScores);
    // Retrieves the scores by a single judge
    app.post('/api/scores/getjudgescores', auth.hasAccess(3), services.scoreService.getScoresForJudge);
    // Post scores for a team as a judge
    app.post('/api/scores/postjudgescores', auth.hasAccess(3), services.scoreService.setScoresForJudge);
    // Retrieves the scores for anonymous user
    app.post('/api/scores/getanonymousscores', services.scoreService.getScoresForAnonymous);
    // Post scores for a team as an anonymous
    app.post('/api/scores/postanonymousscores', services.scoreService.setScoresForAnonymous);
    // Create new mentor
    app.post('/api/mentor/new', auth.hasAccess(2), services.mentorService.newMentorCreate);
    // Assign new mentor to a HACKATHON
    app.post('/api/mentor/assign', auth.hasAccess(2), services.mentorService.assignMentor);
    // Update mentor information
    app.post('/api/mentor/info/:mentorId', auth.hasAccess(2), services.mentorService.updateMentorInfo);
}

module.exports = Routes;


//curl -H "Content-Type: application/json" -X POST -d '{"NAME":"xyz","DESCRIPTION":"loremIPSUM"}' http://localhost:6006/api/hackathon/10
//curl -H "Content-Type: application/json" -X POST -d '{"ASSIGN":true,"USERID":"b6fad27ad137731c5881bb37060210f4d1169e08","HACKATHONID":1}' http://localhost:6006/api/judge/assign
//curl -i -H "Content-Type: application/json" -X POST -d '{"name":"Jolanta","surname":"Pope","description":"Some kind of a judge, dunno","userID":"902aa2c90633ece4f42f752104036828e5c0f319"}' http://localhost:6006/api/user/info
//curl -i -H "Content-Type: application/json" -X POST -d '{"name":"Kazkoks","surname":"Vardas","description":"Some kind of a judge, dunno","email":"vardas@kazkoks.lt"}' http://localhost:6006/api/user/register
//curl -i -H "Content-Type: application/json" -X POST -d '{"name":"Kazkoks","surname":"Vardas","description":"Some kind of a judge, dunno","email":"vardas@kazkoks.lt"}' http://localhost:6006/api/user/register
//curl -i -H "Content-Type: application/json" -X POST -d '{"userId":"82c424af94ea84bc0e7315956fdef6b9913575f2", "hackathonId":1}' http://localhost:6006/api/scores/getjudgescores
//curl -i -H "Content-Type: application/json" -X POST -d '{"NAME":"xyz","DESCRIPTION":"loremIPSUM", "image": "www.nothing"}' http://localhost:6006/api/hackathon/new
