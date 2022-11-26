const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const errorMiddleware = require("./middleware/errors");
const cookieParser = require("cookie-parser");

// eneable bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// enable CORS
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
    });


//Importar rutas
const products = require("./routes/products");
const users = require("./routes/auth");
const orders = require("./routes/orders");

// Middleware
app.use("/api", products); //Sujeto a decision (ruta del navegador)
app.use("/api", users);
app.use("/api", orders);

// Middleware para manejar errores
app.use(errorMiddleware);

module.exports = app;
