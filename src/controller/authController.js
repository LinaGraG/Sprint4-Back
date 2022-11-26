const userModel = require("../models/auth");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const tokenSubmitted = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// Registrar un nuevo usuario /api/user/register
exports.userRegistration = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  const user = await userModel.create({
    firstName,
    lastName,
    email,
    password,
    avatar: {
      public_id: "ANd9GcQKZwmqodcPdQUDRt6E5cPERZDWaqy6ITohlQ&usqp",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKZwmqodcPdQUDRt6E5cPERZDWaqy6ITohlQ&usqp=CAU",
    },
  });
  tokenSubmitted(user, 201, res);
});

// Iniciar Sesion - Login
exports.userLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Revisar si los campos estan completos
  if (!email || !password) {
    return next(new ErrorHandler("Por favor ingrese email y contraseña", 400));
  }

  // Buscar al usuario en nuestra base de datos
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Email o contraseña invalidos", 401));
  }

  // Comparar contraseñas, verificar si está bien
  const confirmPassword = await user.comparePassword(password);

  if (!confirmPassword) {
    return next(new ErrorHandler("Contraseña invalida", 401));
  }

  tokenSubmitted(user, 200, res);
});

// Cerrar sesion
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Se cerró la sesión",
  });
});

// Olvido de contraseña
exports.passwordRecovery = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("El usuario no se encuentra registrado", 404));
  }

  const resetToken = user.genResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Crear una url para hacer el reset de la contraseña

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/resetPassword/${resetToken}`;

  const message = `Hola!\n\nEl enlace para recuperar la contraseña es el siguiente: \n\n${resetURL}\n\nSi no solicitaste este enlace, por favor comunicate con soporte.\n\nAtt: Artelak`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Artelak password recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Correo enviado a: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Resetear la contraseña
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash del token que llegó con la URL
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  // Buscamos al usuario al que se le va a resetear la contraseña
  const user = await userModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  // El usuario existe en la base de datos?
  if (!user) {
    return next(new ErrorHandler("El token es inválido o ya expiró", 403));
  }

  // Diligenciamos bien los campos?
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Las contraseñas no coinciden", 400));
  }

  // Setear la contraseña nueva
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  tokenSubmitted(user, 200, res);
});

// Ver perfil de usuario (usuario que está logueado)
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.body.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update contraseña (usuario logueado)
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.user.id).select("+password");

  // Revisamos si la contraseña antigua es igual la nueva
  const confirmPassword = await user.comparePassword(req.body.oldPassword);

  if (!confirmPassword) {
    return next(new ErrorHandler("La contraseña actual no es correcta", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  tokenSubmitted(user, 200, res);
});

//Update perfil de usuario (logueado)
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  //Actualizar el email por user a decisiòn de cada uno
  const newUserData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    /*email: req.body.email*/
  };

  //update Avatar: pendiente

  const user = await userModel.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Servicios controladores sobre usuarios por parte de los ADMIN
// Ver todos los usuarios
exports.getUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await userModel.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Ver el detalle de un usuario
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(
        `No se ha encontrado ningún usuario con el id: ${req.params.id}`
      )
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//Actualizar perfil de usuario (como administrador)
exports.updateUser= catchAsyncErrors (async(req, res, next)=>{
  const newData={
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      role: req.body.role
  }

  const user= await userModel.findByIdAndUpdate(req.params.id, newData, {
      new: true,
      runValidators: true,
      useFindAndModify: false
  })

  res.status(200).json({
      success:true,
      user
  })
})

// Borrar perfil de usuario (como administrador)
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.params.id); //Variable de tipo modificable

  if (!user) {
    return next(
      new ErrorHandler(
        `El usuario con ${req.params.id} no fue encontrado en la base de datos`,
        404
      )
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "Usuario eliminado correctamente",
  });
});

// Cambiar el estado del usuario a inactivo (como administrador)
exports.inactiveUser = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.params.id); //Variable de tipo modificable
});
