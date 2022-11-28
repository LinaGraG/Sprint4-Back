const Order = require("../models/order");
const Product = require("../models/product");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

//Crear una nueva orden
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    Items,
    envioInfo,
    precioItems,
    precioImpuesto,
    precioEnvio,
    precioTotal,
    pagoInfo
  } = req.body;

  const order = await Order.create({
    Items,
        envioInfo,
        precioItems,
        precioImpuesto,
        precioEnvio,
        precioTotal,
        pagoInfo,
        fechaPago: Date.now(),
        user: req.user._id
  });

  res.status(201).json({
    success: true,
    order,
  });
});

//Ver una orden
exports.getOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order
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
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

//Admin
//Ver todas la ordenes (Administrador)
exports.sales = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let sales = 0;
  orders.forEach((order) => {
    sales += order.precioTotal;//Variable acumuladora
  });

  res.status(200).json({
    success: true,
    sales,
    orders,
  });
});

//Editar una orden (admin)
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Orden no encontrada", 404));
  }

  if (order.estado === "Enviado") {
    return next(new ErrorHandler("Esta orden ya fue enviada", 400));
  }

  order.estado = req.body.estado; 
  order.fechaEnvio = Date.now();

  await order.save();

  res.status(200).json({
    success: true,
    order,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.inventario = product.inventario - quantity;
  await product.save({ validateBeforeSave: false });
}

//Eliminar una orden (admin)
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Esta orden no esta registrada", 404));
  }
  await order.remove();

  res.status(200).json({
    success: true,
    message: "Orden eliminada correctamente",
  });
});
