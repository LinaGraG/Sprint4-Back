const { SchemaTypeOptions } = require("mongoose");
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    service: 'office365',
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: "maria25mm@hotmail.com",
      pass: "elbsgzmcpnfshhaj",
    },
  });

  const message = {
    from: "Artelak <maria25mm@hotmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transport.sendMail(message);
};

module.exports = sendEmail;
