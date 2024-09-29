require("dotenv").config();
const Paypal = require("paypal-recurring");
const paypal = new Paypal({
  username: process.env.PAYPAL_EMAIL,
  password: process.env.PAYPAL_PASSWORD,
  signature: process.env.PAYPAL_SECRET,
  environment: "development"
});
module.exports = paypal;