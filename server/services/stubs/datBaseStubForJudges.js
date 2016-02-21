var util = require('util');
var ibmdb = require('ibm_db');

/* istanbul ignore next */
module.exports = {
    sqlController: function(message, callback) {
        var information =
        [
            {
              "name": "Aiste Mikiene",
              "email": "mik@mail.as",
              "description": "AM judge"
            },
            {
              "name": "Jolanta Pope",
              "description": "JP judge"
            },
            {
              "name": "Arturas Rope",
              "email": "mik@mail.as",
              "description": "AR judge"
            },
            {
              "name": "Aiste Mikiene",
              "email": "mik@mail.as",
              "description": "AM judge"
            },
            {
              "name": "Jolanta Pope",
              "description": "JP judge"
            },
            {
              "name": "Arturas Rope",
              "email": "mik@mail.as",
              "description": "AR judge"
            },
            {
              "name": "Aiste Mikiene",
              "description": "AM judge"
            },
            {
              "name": "Jolanta Pope",
              "description": "JP judge"
            },
            {
              "name": "Arturas Rope",
              "description": "AR judge"
            },
            {
              "name": "Aiste Mikiene",
              "description": "AM judge"
            },
            {
              "name": "Jolanta Pope",
              "description": "JP judge"
            },
            {
              "name": "Arturas Rope",
              "description": "AR judge"
            }
        ];
        //return(information);
        console.log("Information that sent:" + information);
        callback(information);
    }
};
