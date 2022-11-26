const { SchemaTypeOptions } = require("mongoose");
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: "prueba.artelak@gmail.com",
      pass: "kwyzeyolkxhnrakg",
    },
  });

  const message = {
    from: "Artelak <noreply@artelak.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transport.sendMail(message);
};

module.exports = sendEmail;
