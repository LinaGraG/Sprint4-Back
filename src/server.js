const app = require("./app");
const connectDatabase = require("./config/database");

const dotenv = require("dotenv");
dotenv.config({ path: "src/config/config.env" });
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Welcome to Artelak API");
});

//Configurar base de datos
connectDatabase();

//Llamemos al server
const server = app.listen(port, () => {
  console.log(
    `Servidor iniciado en el puerto: ${port} en modo: ${process.env.NODE_ENV}`
  );
});
