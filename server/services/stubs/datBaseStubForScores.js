var util = require('util');
var ibmdb = require('ibm_db');

/* istanbul ignore next */
module.exports = {
    sqlController: function(message, callback) {
        var information = [
                        {"Team": "IBM", "Speed": 5, "Size": 5, "Wow": 5, "Many": 5, "Such": 5, "Much": 5},
                        {"Team": "DNB", "Speed": 4, "Size": 3, "Wow": 5, "Many": 2, "Such": 5, "Much": 3},
                        {"Team": "SEB", "Speed": 3, "Size": 3, "Wow": 4, "Many": 3, "Such": 2, "Much": 1},
                        {"Team": "Barclays", "Speed": 4, "Size": 4, "Wow": 4, "Many": 4, "Such": 4, "Much": 4},
                        {"Team": "Bentley", "Speed": 3, "Size": 4, "Wow": 5, "Many": 5, "Such": 4, "Much": 3},
                        {"Team": "EA", "Speed": 4, "Size": 3, "Wow": 5, "Many": 2, "Such": 5, "Much": 3},
                        {"Team": "Ubisoft", "Speed": 3, "Size": 3, "Wow": 4, "Many": 3, "Such": 2, "Much": 1},
                        {"Team": "People's Liberation Army of China", "Speed": 5, "Size": 5, "Wow": 5, "Many": 5, "Such": 5, "Much": 5},
                        {"Team": "North Korea", "Speed": 0, "Size": 0, "Wow": 0, "Many": 0, "Such": 0, "Much": 0}
                        ];
        //return(information);
        callback(information);
    }
};
