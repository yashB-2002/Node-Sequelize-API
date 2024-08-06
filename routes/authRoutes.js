const express = require('express');
const router = express.Router();
const authController = require('../authController')

router.route('/signup').post(authController.register)
router.route('/signin').post(authController.login)
router.route('/refresh').post(authController.refreshToken)
router.route('/logout').post(authController.logout)

module.exports = router;
