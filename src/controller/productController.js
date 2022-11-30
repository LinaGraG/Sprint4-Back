const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const productModel = require("../models/product");
const APIFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");
const fetch = (url) =>import("node-fetch").then(({ default: fetch }) => fetch(url));

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
  const productsCount = await productModel.countDocuments();

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
  fetch("`mongodb+srv://sprint4:A6SaCZ4jrUEFAGAq@sprint4.3qpoelt.mongodb.net/?retryWrites=true&w=majority")
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
}

//verProductos(); //LLamamos al metodo creado para probar la consulta

//Ver por id
function verProductoPorID(id) {
  fetch("`mongodb+srv://sprint4:A6SaCZ4jrUEFAGAq@sprint4.3qpoelt.mongodb.net/?retryWrites=true&w=majority" + id)
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
}

//verProductoPorID('6384178428404123393acf9f'); // Probamos el metodo con un id

//Crear o actualizar una review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comentario, idProducto } = req.body;

  const opinion = {
    clientName: req.user.name,
    rating: Number(rating),
    comentario,
  };

  const product = await productModel.findById(idProducto);

  const isReviewed = product.opiniones.find(
    (item) => item.clientName === req.user.name  
  );

  if (isReviewed) {
    product.opiniones.forEach((opinion) => {
      if (opinion.clientName === req.user.name) {
        opinion.comentario = comentario, 
        opinion.rating = rating;
      }
    });
  } else {
    product.opiniones.push(opinion);
    product.numCalificaciones = product.opiniones.length;
  }

  product.calificacion = product.opiniones.reduce((acc, opinion) => 
  opinion.rating + acc, 0) / product.opiniones.length;

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
    reviews: product.opiniones,
  });
});

//Eliminar review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await productModel.findById(req.query.idProducto);

  const opiniones = product.opiniones.filter(opinion => 
    opinion._id.toString() !== req.query.idReview.toString());

  const numCalificaciones = opiniones.length;

  const calificacion =product.opiniones.reduce((acc, Opinion) => 
  Opinion.rating + acc, 0) /opiniones.length;

  await productModel.findByIdAndUpdate(req.query.idProducto,{
    opiniones,
    calificacion,
    numCalificaciones
    },{
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
