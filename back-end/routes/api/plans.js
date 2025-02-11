const express = require('express');
const router = express.Router();
const planController = require('../../controllers/planController');
const rolesList = require('../../config/rolesList')
const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
      .get(verifyRoles(rolesList.User), planController.getAllPlans)
      .post(verifyRoles(rolesList.Admin), planController.createPlan)
      .delete(verifyRoles(rolesList.Admin), planController.deletePlan)


module.exports = router;