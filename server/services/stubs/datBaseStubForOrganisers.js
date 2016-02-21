var util = require('util');
var ibmdb = require('ibm_db');

/* istanbul ignore next */
module.exports = {
    sqlController: function(message, callback) {
        var information =
        [
            {
              "name": "Tomas Armonika",
              "description": "TA Organizer",
              "email": "myEmail@mail.com",
              "hackathonID": "1"
            },
            {
              "name": "Ambrazejus Kukulis",
              "description": "AK Organizer",
              "email": "myEmail@mail.com",
              "hackathonID": "1"
            },
            {
              "name": "James Patterson",
              "description": "TA Organizer",
              "email": "myEmail@mail.com",
              "hackathonID": "1"
            },
            {
              "name": "Maria Sharapova",
              "description": "AK Organizer",
              "email": "myEmail@mail.com",
              "hackathonID": "1"
            },
            {
              "name": "Tomas Armonika",
              "description": "TA Organizer",
              "email": "myEmail@mail.com",
              "hackathonID": "2"
            },
            {
              "name": "Ambrazejus Kukulis",
              "description": "AK Organizer",
              "email": "myEmail@mail.com",
              "hackathonID": "2"
            },
            {
              "name": "Edgar Allan Poe",
              "description": "TA Organizer",
              "email": "myEmail@mail.com",
              "hackathonID": "2"
            },
            {
              "name": "Teri Hatcher",
              "description": "TA Organizer",
              "email": "myEmail@mail.com",
              "hackathonID": "2"
            },
            {
              "name": "Roger Federer",
              "description": "TA Organizer",
              "email": "myEmail@mail.com",
              "hackathonID": "2"
            },
            {
              "name": "Moses",
              "description": "TA Organizer",
              "email": "myEmail@mail.com",
              "hackathonID": "2"
            }
        ];
        //return(information);
        console.log("Information that sent:" + information);
        callback(information);
    }
};
