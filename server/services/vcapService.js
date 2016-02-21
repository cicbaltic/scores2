var fs = require('fs');
var yaml = require('js-yaml');

function Fetch() {
    this.readManifest = function readManifest() {
        return yaml.safeLoad(fs.readFileSync('../../manifest.yml', 'utf8'));
    };

    this.getVCAP = function getVCAP() {
        try {
            return JSON.parse(process.env.VCAP_SERVICES);
        } catch (err) {
            //console.log("another one fails and runs this one");
            return JSON.parse(fs.readFileSync('local_VCAP', 'utf8'));
        }
    };
}

module.exports = exports = new Fetch();
