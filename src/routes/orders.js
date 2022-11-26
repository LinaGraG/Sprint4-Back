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

const { isUserAuthenticated, authorizedRoles } = require("../middleware/auth");

router.route("/order/new").post(isUserAuthenticated, newOrder);
router.route("/order/:id").get(isUserAuthenticated, getOrder);
router.route("/orders/myOrders").get(isUserAuthenticated, myOrders);

//rutas de admin
router
  .route("/admin/sales")
  .get(isUserAuthenticated, authorizedRoles("admin"), sales);
router
  .route("/admin/order/:id")
  .put(isUserAuthenticated, authorizedRoles("admin"), updateOrder);
router
  .route("/admin/order/:id")
  .delete(isUserAuthenticated, authorizedRoles("admin"), deleteOrder);

module.exports = router;
