const express = require('express');
const router = express.Router();
const orgController = require('../../controllers/orgController');
const rolesList = require('../../config/rolesList')
const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
      .get(verifyRoles(rolesList.User), orgController.getAllOrgs)
      .post(verifyRoles(rolesList.Admin), orgController.createOrg)
      .delete(verifyRoles(rolesList.Admin), orgController.deleteOrg)


module.exports = router;