const User = require("../models/auth");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

//Verificamos si estamos autenticados, (existencia y veracidad del token)
exports.isUserAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      new ErrorHandler("Debe iniciar sesion para acceder a este recurso", 401)
    );
  }

  const decrypted = jwt.decode(token, process.env.JWT_SECRET);
  req.user = await User.findById(decrypted.id);

  next();
});

//Capturamos role
exports.authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `El rol (${req.user.role}) no esta autorizado a entrar a esta area`,
          403
        )
      );
    }
    next();
  };
};
