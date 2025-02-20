const express = require('express');
const router = express.Router();
const planCourseController = require('../../controllers/planCourseController');
const rolesList = require('../../config/rolesList')
const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
      .get(verifyRoles(rolesList.User), planCourseController.getAllPlanCourses)
      .post(verifyRoles(rolesList.Editor, rolesList.Admin), planCourseController.createPlanCourses)
      .delete(verifyRoles(rolesList.Admin), planCourseController.deletePlanCourse)


module.exports = router;