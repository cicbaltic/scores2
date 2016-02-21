function authenticate(req, res) {
    res.status(req.data.statusCode).json(req.data);
}
module.exports = authenticate;
