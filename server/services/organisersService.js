function QueryService (req, res) {
    var message = req.body;
    var querry =  {'querry': 'someQuerry'};
    var dbServeletOrganisers = new require('./stubs/datBaseStubForOrganisers');
    dbServeletOrganisers.sqlController(querry, function(results) {
        res.send(results);
    });
};

module.exports = QueryService;
