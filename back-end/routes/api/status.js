const express = require('express');
const router = express.Router();
const statusController = require('../../controllers/statusController');
const rolesList = require('../../config/rolesList')
const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
      .get(verifyRoles(rolesList.User), statusController.getAllStatus)
      .post(verifyRoles(rolesList.Admin), statusController.createStatus)
      .delete(verifyRoles(rolesList.Admin), statusController.deleteStatus)


module.exports = router;