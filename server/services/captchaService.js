var captchapng = require('captchapng');

var captchaImg = function(){
    numCaptcha = parseInt(Math.random()*9000+1000);
    var p = new captchapng(80,30, numCaptcha); // width,height,numeric captcha
    p.color(115, 95, 197, 100);  // First color: background (red, green, blue, alpha)
    p.color(30, 104, 21, 255); // Second color: paint (red, green, blue, alpha)
    var img = p.getBase64();
    var imgbase64 = new Buffer(img,'base64');
    //img code
    var valicode = new Buffer(imgbase64).toString('base64');
    return {image: valicode, numeric: numCaptcha};
} 

var getCaptcha = function(req, res){
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(captchaImg()));
};

// function getCaptcha(req, res){
//     res.writeHead(200, {
//         'Content-Type': 'image/png'
//     });
//     res.end(captchaImg());
// }


module.exports = getCaptcha;