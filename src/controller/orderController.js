const orderModel = require("../models/order");
const productModel = require("../models/product");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

//Crear una nueva orden
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shipmentInfo,
    items,
    paymentInfo,
    itemsPrice,
    taxesPrice,
    shipmentPrice,
    totalPrice,
  } = req.body;

  const order = await orderModel.create({
    items,
    shipmentInfo,
    itemsPrice,
    taxesPrice,
    shipmentPrice,
    totalPrice,
    paymentInfo,
    paymentDate: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

//Ver una orden
exports.getOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await orderModel
    .findById(req.params.id)
    .populate("user", "name email"); //restriccion de usuario

  if (!order) {
    return next(new ErrorHandler("No encontramos una orden con ese Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//Ver todas mis ordenes (usuario logueado)
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await orderModel.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

//Admin
//Ver todas la ordenes (Administrador)
exports.sales = catchAsyncErrors(async (req, res, next) => {
  const orders = await orderModel.find();

  let sales = 0;
  orders.forEach((order) => {
    sales += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    sales,
    orders,
  });
});

//Editar una orden (admin)
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Orden no encontrada", 404));
  }

  if (order.shipmentStatus === "Enviado") {
    return next(new ErrorHandler("Esta orden ya fue enviada", 400));
  }

  order.shipmentStatus = req.body.shipmentStatus;
  order.shipmentDate = Date.now();

  await order.save();

  res.status(200).json({
    success: true,
    order,
  });
});

async function updateStock(id, quantity) {
  const product = await productModel.findById(id);
  product.inventory = product.inventory - quantity;
  await product.save({ validateBeforeSave: false });
}

//Eliminar una orden (admin)
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Esta orden no esta registrada", 404));
  }
  await order.remove();

  res.status(200).json({
    success: true,
    message: "Orden eliminada correctamente",
  });
});
