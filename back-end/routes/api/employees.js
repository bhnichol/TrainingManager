const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/employeeController');
const rolesList = require('../../config/rolesList')
const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
      .get(verifyRoles(rolesList.User), employeeController.getAllEmployees)
      .post(verifyRoles(rolesList.Editor, rolesList.Admin),employeeController.createEmployee)
      .delete(verifyRoles(rolesList.Admin), employeeController.deleteEmployee)


module.exports = router;