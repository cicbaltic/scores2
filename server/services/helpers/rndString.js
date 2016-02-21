function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomChar() {
    var selector = {
        1: { min: 48, max: 57 },
        2: { min: 65, max: 90 },
        3: { min: 97, max: 122 }
    };
    var set = selector[getRandomInt(1, 3)];
    return String.fromCharCode(getRandomInt(set.min, set.max));
}

function getRandomString(len) {
    var secret = '';
    do {
        secret += getRandomChar();
    } while (secret.length < len);
    return secret;
}

module.exports = getRandomString;
