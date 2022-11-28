const express = require("express");
const {
  userRegistration,
  userLogin,
  logout,
  passwordRecovery,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  getUsers,
  getUserDetails,
  updateUser,
  deleteUser,

} = require("../controller/authController");
const { isAuthenticatedUser, authorizeRoles  } = require("../middleware/auth");
const router = express.Router();

// Rutas gestionadas por user
router.route("/user/register").post(userRegistration);
router.route("/user/login").post(userLogin);
router.route("/user/logout").get(isAuthenticatedUser, logout);
router.route("/user/passwordRecovery").post(passwordRecovery);
router.route("/user/resetPassword/:token").post(resetPassword);
router.route("/user").get(isAuthenticatedUser, getUserProfile);
router.route("/user/updatePassword").put(isAuthenticatedUser, updatePassword);
router.route("/user/ ").put(isAuthenticatedUser, updateProfile);

// Rutas gestionadas por admin
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getUsers);
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails);
router.route("/admin/updateUser/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateUser);
router.route("/admin/deleteUser/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
