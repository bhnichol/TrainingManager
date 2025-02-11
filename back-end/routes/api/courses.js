const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/courseController');
const rolesList = require('../../config/rolesList')
const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
      .get(verifyRoles(rolesList.User), courseController.getAllCourses)
      .post(verifyRoles(rolesList.Editor, rolesList.Admin),courseController.createCourse)
      .delete(verifyRoles(rolesList.Admin), courseController.deleteCourse)


module.exports = router;