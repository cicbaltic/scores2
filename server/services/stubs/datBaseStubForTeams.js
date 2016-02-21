var util = require('util');
var ibmdb = require('ibm_db');

/* istanbul ignore next */
module.exports = {
    sqlController: function(message, callback) {
        var information = [
            {
                "id": 1,
                "name": "IBM",
                "description": "Lorem ipsum"
            }, {
                "id": 2,
                "name": "DNB",
                "description": "Lorem ipsum"
            }, {
                "id": 3,
                "name": "SEB",
                "description": "Lorem ipsum"
            }, {
                "id": 4,
                "name": "Barclays",
                "description": "Lorem ipsum"
            }, {
                "id": 5,
                "name": "Bentley",
                "description": "Lorem ipsum"
            }, {
                "id": 6,
                "name": "EA",
                "description": "Lorem ipsum"
            }, {
                "id": 7,
                "name": "Ubisoft",
                "description": "Lorem ipsum"
            }, {
                "id": 8,
                "name": "People's Liberation Army of China",
                "description": "Lorem ipsum"
            }
        ];
        //return(information);
        console.log("Information that sent:" + information);
        callback(information);
    }
};
