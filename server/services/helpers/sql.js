function SqlHelper() {
    this.serializeForInsert = function serializeForInsert(json) {
        var keys = "";
        var values = "";
        var jKeys = Object.keys(json);
        for (var i = 0; i < jKeys.length; i++) {
            keys += (jKeys[i] + ", ");
            values += ("\'" + json[jKeys[i]] + "\', ");
        }
        keys = keys.substring(0, keys.length - 2);
        values = values.substring(0, values.length - 2);
        return [keys, values];
    };

    this.serializeForUpdate = function serializeForUpdate(json) {
        var keys = Object.keys(json);
        var result = "";
        for (var i = 0; i < keys.length; i++) {
            result += (keys[i] + "=\'" + json[keys[i]] + "\', ");
        }
        return result.substring(0, result.length - 2);
    };
}
module.exports = SqlHelper;
