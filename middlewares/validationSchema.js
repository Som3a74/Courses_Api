const { body } = require("express-validator")

let validationSchema = () => {
    return [
        body('name')
            .notEmpty().withMessage('name is required')
            .isLength({ min: 2 }).withMessage('min is 2'),

        body('price')
            .notEmpty().withMessage('price is required')

    ]
}

module.exports = {
    validationSchema
}