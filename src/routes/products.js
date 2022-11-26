const express = require("express");
const router = express.Router();

const {
  getProducts,
  newProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../controller/productController"); //Traemos la respuesta json desde el controlador
const { isUserAuthenticated, authorizedRoles } = require("../middleware/auth");

router
  .route("/product/new")
  .post(isUserAuthenticated, authorizedRoles("admin"), newProduct); //establecemos la ruta
router.route("/products").get(getProducts); // Establecemos desde que ruta queremos ver el getProducts
router.route("/product/:id").get(getProductById); // Ruta para consulta por Id
router
  .route("/product/:id")
  .put(isUserAuthenticated, authorizedRoles("admin"), updateProduct); //Ruta para actualizar producto
router
  .route("/product/:id")
  .delete(isUserAuthenticated, authorizedRoles("admin"), deleteProduct); //Ruta para eliminar producto

// Reviews
router.route("/review").put(isUserAuthenticated, createProductReview);
router.route("/reviews").get(getProductReviews);
router.route("/review").delete(isUserAuthenticated, deleteReview);

module.exports = router;
