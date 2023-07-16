const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

exports.sendMail = (to, subject, text, html) => {
  const costumOption = {
    from: process.env.EMAIl,
    to,
    subject,
    text,
    html,
  };
  transport.sendMail(costumOption, (err, info) => {
    if (err) return console.log(err);
    console.log(`Email has send ${info}`);
  });
};
