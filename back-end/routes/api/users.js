const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const rolesList = require('../../config/rolesList')
const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
      .get(verifyRoles(rolesList.Editor),userController.getAllUsers)
      .delete(userController.deleteUser)


module.exports = router;