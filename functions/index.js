"use strict";
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });

exports.contactMe = functions.https.onRequest((req, res) => {
  console.log(req);
  cors(req, res, () => {
    sendEmail(req.body);
    res.status(200).send({});
  });
});

function sendEmail(params) {
  console.log(params);
  if (!params.name || !params.email || !params.message) {
    return;
  }
  const config = functions.config();
  const auth = config.auth;
  const mail = config.mail;
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      type: "OAuth2",
      user: auth.user,
      clientId: auth.client_id,
      clientSecret: auth.client_secret,
      refreshToken: auth.refresh_token,
      accessToken: auth.access_token,
      expires: auth.expires
    }
  });

  const mailOptions = {
    from: mail.from,
    to: mail.to,
    subject: `Website Contact Form:  ${params.name}`,
    text: `You have received a new message from your website contact form.
      
    Here are the details:
    
    Name:  ${params.name}
    
    Email: ${params.email}
    
    Phone: ${params.phone}
    
    Message:
    
      ${params.message}`
  };
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
}
