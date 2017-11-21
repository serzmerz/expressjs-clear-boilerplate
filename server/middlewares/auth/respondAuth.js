module.exports = function respond(req, res) {
    res.status(200).json({
        user: req.user,
        token: req.token
    });
}
