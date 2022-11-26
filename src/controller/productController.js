const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const productModel = require("../models/product");
const APIFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");
const fetch = (url) =>
  import("node-fetch").then(({ default: fetch }) => fetch(url));

// Create product /api/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;

  const product = await productModel.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

//Ver la lista de productos
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const resultsPerPage = 5;
  const productsCount = await productModel.count();

  const apiFeatures = new APIFeatures(productModel.find(), req.query)
    .search()
    .filter();

  let products = await apiFeatures.query;
  let filteredProductsCount = products.length;
  apiFeatures.pagination(resultsPerPage);
  products = await apiFeatures.query.clone();

  if (!products) {
    return next(new ErrorHandler("Informacion no encontrada", 404));
  }

  res.status(200).json({
    success: true,
    productsCount,
    resultsPerPage,
    filteredProductsCount,
    products,
  });
});

// Ver un producto por Id
exports.getProductById = catchAsyncErrors(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Producto no encontrado", 404));
  } else {
    res.status(200).json({
      success: true,
      message: "Aquí encuentras la información de tu producto",
      product,
    });
  }
});

//Update producto
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await productModel.findById(req.params.id); //Variable de tipo modificable

  if (!product) {
    return next(new ErrorHandler("Producto no encontrado", 404));
  }

  product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Producto actualizado corectamente",
    product,
  });
});

//Eliminar un producto
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await productModel.findById(req.params.id); //Variable de tipo modificable

  if (!product) {
    return next(new ErrorHandler("Producto no encontrado", 404));
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Producto eliminado correctamente",
  });
});

//HABLEMOS DE FETCH
//Ver todos los productos
function verProductos() {
  fetch("http://localhost:4000/api/products")
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
}

//verProductos(); //LLamamos al metodo creado para probar la consulta

//Ver por id
function verProductoPorID(id) {
  fetch("http://localhost:4000/api/product/" + id)
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
}

//verProductoPorID('63456a8d9163cb9dbbcaa235'); // Probamos el metodo con un id

//Crear o actualizar una review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, commentary, productId } = req.body;

  const review = {
    clientName: req.user.name,
    rating: Number(rating),
    commentary,
  };

  const product = await productModel.findById(productId);

  const isReviewed = product.reviews.find(
    (item) => item.clientName === req.user.name
  );

  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.clientName === req.user.name) {
        (review.commentary = commentary), (review.rating = rating);
      }
    });
  } else {
    product.reviews.push(review);
    product.qualifications = product.reviews.length;
  }

  product.rating =
    product.reviews.reduce((acc, review) => review.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Se ha creado la opinión correctamente",
  });
});

//Ver todas las review de un producto
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await productModel.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//Eliminar review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await productModel.findById(req.query.productId);

  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.reviewId.toString()
  );

  const qualifications = reviews.length;

  const rating =
    product.reviews.reduce((acc, review) => review.rating + acc, 0) /
    reviews.length;

  await productModel.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      rating,
      qualifications,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
    message: "Review eliminada correctamente",
  });
});
