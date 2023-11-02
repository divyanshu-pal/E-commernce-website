const express = require('express');
const router = express.Router();

const register= require('../controllers/authController')
const {getUserProfile,updatePassword,updateProfile,allUsers,getUserDetails,updateUser} = require('../controllers/authController')
const {isAuthenticatedUser, authorizeRoles} = require('../middelwares/auth');
router.post('/register',register.registerUser);
router.post('/login',register.loginUser);
router.post('/password/forgot',register.forgotPassword);
router.put('/password/reset/:token',register.resetPassword);
router.get('/logout',register.logoutUser);
// router.get('/me',register.getUserProfile);
router.route('/me').get(isAuthenticatedUser,getUserProfile)
router.route('/password/update').put(isAuthenticatedUser,updatePassword);
router.route('/me/update').put(isAuthenticatedUser,updateProfile);


router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'),allUsers);
router.route('/admin/user/:id')
       .get(isAuthenticatedUser,authorizeRoles('admin'),getUserDetails)
       .put(isAuthenticatedUser,authorizeRoles('admin'),updateUser);
//2nd method 
//router.route('/password/forgot').post(forgotpassword);
module.exports = router;