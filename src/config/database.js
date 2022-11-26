const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      console.log(
        `Connected to MongoDB Atlas: ${con.connection.host}`
      );
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = connectDatabase;
