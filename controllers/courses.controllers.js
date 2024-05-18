const { validationResult } = require('express-validator');

const Course = require('../models/course.models');

const { SUCCESS, FAIL, ERROR } = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const handelErrors = require('../utils/handelErrors');

const getAllCourses = async (req, res) => {
    const query = req.query
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    // Pagination
    const courses = await Course.find().limit(limit).skip(skip)

    res.status(200).json({ status: SUCCESS, data: { coursessssssss: courses } })
}


const getcourseDetails = asyncWrapper(
    async (req, res, next) => {

        const courseDetails = await Course.findById(req.params.id)

        if (!courseDetails) {
            const error = handelErrors.create("not found course", 404, FAIL)
            return next(error)
        }
        return res.json({ status: SUCCESS, data: { courseDetails } })
    }
)

const AddCourse = asyncWrapper(
    async (req, res, next) => {

        if (!Object.keys(req.body).length) { // clac lenght of object to know body send or not 
            const error = handelErrors.create("you shoud send Body", 400, ERROR)
            return next(error)
        }

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const error = handelErrors.create(errors.array()[0].msg, 400, FAIL)
            return next(error)
        }

        const newCourse = new Course(req.body)
        await newCourse.save();

        res.status(201).json({ status: SUCCESS, data: { newCourse } })
    }
)

const Updatecourse = asyncWrapper(
    async (req, res) => {
        let courseDetails = await Course.findByIdAndUpdate(req.params.id, { $set: { ...req.body } })
        res.status(201).json({ status: SUCCESS, data: { courseDetails } })
    }
)

const Deletecourse = async (req, res) => {
    let courseDetails = await Course.findByIdAndDelete(req.params.id)
    res.status(200).json({ status: SUCCESS, data: null })
}

module.exports = {
    getAllCourses,
    getcourseDetails,
    AddCourse,
    Updatecourse,
    Deletecourse
}
