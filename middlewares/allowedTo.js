const handelErrors = require("../utils/handelErrors")

module.exports = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.currentUser.role)) return next(handelErrors.create('this role is not authorized', 401))
        next();
    }
}