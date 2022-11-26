//Crear y enviar un token guardado en una cookie
const tokenSubmitted = (user, statusCode, res) => {
  //Creamos el token
  const token = user.getJwtToken();

  //Opciones del token
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};

module.exports = tokenSubmitted;
