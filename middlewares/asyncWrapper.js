module.exports = (fun) => {
    return (req, res, next) => {
        fun(req, res, next).catch((error) => {
            next(error)
        })
    }
}