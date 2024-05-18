const { body } = require('express-validator');
const asyncWrapper = require('../middlewares/asyncWrapper');
const User = require('../models/users.models');
const { SUCCESS, FAIL, ERROR } = require('../utils/httpStatusText');
const handelErrors = require('../utils/handelErrors');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var generateJWT = require('../utils/generateJWT');
const multer = require('multer');

const getAllUsers = asyncWrapper(
    async (req, res, next) => {
        const query = req.query
        const limit = query.limit || 10;
        const page = query.page || 1;
        const skip = (page - 1) * limit;

        const users = await User.find().limit(limit).skip(skip)

        res.json({ status: SUCCESS, data: { users } })
    }
)


const register = asyncWrapper(
    async (req, res, next) => {
        const { firstName, lastName, email, password, role } = req.body
        if (!Object.keys(req.body).length) return next(handelErrors.create("you shoud send Body", 400, FAIL))

        const checkUser = await User.findOne({ email: email })
        if (checkUser) return next(handelErrors.create("Email already Exist", 400, FAIL))

        //hashing user Password
        const hashedPassword = await bcrypt.hash(password, 8)


        // const storage = multer.diskStorage({
        //     destination: function (req, file, cb) {
        //         cb(null, '/tmp/my-uploads')
        //     },
        //     filename: function (req, file, cb) {
        //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        //         cb(null, file.fieldname + '-' + uniqueSuffix)
        //     }
        // })
        // const upload = multer({ storage: storage })


        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            avatar: req.file.filename
        })


        // craete JWT Token
        const token = await generateJWT({ email: newUser.email, id: newUser.id, role: newUser.role })

        newUser.token = token;
        await newUser.save();

        res.status(201).json({ status: SUCCESS, data: { newUser } })
    }
)



const login = asyncWrapper(
    async (req, res, next) => {

        const { email, password } = req.body

        if (!email && !password) return next(handelErrors.create(" email and password is Required", 400, FAIL))

        const checkUser = await User.findOne({ email: email })
        if (!checkUser) return next(handelErrors.create("you dont have an account", 400, FAIL))

        const matchPassword = await bcrypt.compare(password, checkUser.password)
        if (!matchPassword) return next(handelErrors.create(" email or password is Wrong", 400, FAIL))

        const token = await generateJWT({ email: checkUser.email, id: checkUser._id, role: checkUser.role })
        res.status(201).json({ status: SUCCESS, data: { message: "login success" }, token: token })
    }
)



module.exports = {
    getAllUsers,
    register,
    login
}