function adminPanelRespondService(req, res) {
    res.status(req.data.statusCode).json(req.data);
}
module.exports = adminPanelRespondService;
