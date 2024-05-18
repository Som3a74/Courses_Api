const express = require('express')
const verfiyToken = require('../middlewares/verfiyToken')

const router = express.Router()
const { getAllUsers, register, login } = require('../controllers/users.controller');

const multer = require('multer');
const handelErrors = require('../utils/handelErrors');


const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(file)
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1]
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`
        cb(null, file.fieldname + '-' + fileName)
    }
})

const filterFile = (req, file, cb) => {
    const imgType = file.mimetype.split("/")[0]
    if (imgType === "image") {
        return cb(null, true)
    } else {
        return cb(handelErrors.create("the file must be an image", 400), false)
    }
}


const upload = multer({ storage: diskStorage, fileFilter: filterFile })


router.route('/')
    .get(verfiyToken, getAllUsers)

router.route('/register')
    .post(upload.single('avatar'), register)

router.route('/login')
    .post(login)

module.exports = router;