const express = require("express");
const router = express.Router();

const {
  newOrder,
  getOrder,
  myOrders,
  sales,
  updateOrder,
  deleteOrder,
} = require("../controller/orderController");

const {  isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getOrder);
router.route("/orders/myOrders").get(isAuthenticatedUser, myOrders);

//rutas de admin
router
  .route("/admin/sales")
  .get(isAuthenticatedUser,authorizeRoles("admin"), sales);
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder);
router
  .route("/admin/order/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
