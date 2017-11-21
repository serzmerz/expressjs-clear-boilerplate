module.exports = function serialize(req, res, next) {
    req.user = {
        id: req.user.id
    };
    next();
};
