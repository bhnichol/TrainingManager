const express = require('express');
const router = express.Router();
const roleController = require('../../controllers/roleController');
const rolesList = require('../../config/rolesList')
const verifyRoles = require('../../middleware/verifyRoles')

router.route('/:id')
      .get(verifyRoles(rolesList.Admin),roleController.getUserRoles)


module.exports = router;