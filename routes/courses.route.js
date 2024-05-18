const express = require('express')

const router = express.Router()
const { getAllCourses, getcourseDetails, AddCourse, Updatecourse, Deletecourse } = require('../controllers/courses.controllers');
const { validationSchema } = require('../middlewares/validationSchema');
const verfiyToken = require('../middlewares/verfiyToken');
const allowedTo = require('../middlewares/allowedTo');

//get courses
router.get('/', getAllCourses)

router.post('/', validationSchema(), verfiyToken, allowedTo("ADMIN", "MANGER"), AddCourse)

//delete course
router.route(`/:id`)
    .get(getcourseDetails)
    .patch(Updatecourse)
    .delete(verfiyToken, allowedTo("ADMIN", "MANGER"), Deletecourse);


module.exports = router
