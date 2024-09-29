const paypal = require('../config/paypal');

let ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error_msg", "You must login first to view the page");
    res.redirect("/pages/login-page");
  }
};

let isSubscribed = (req, res, next) => {
  // console.log(process.env.PAYPAL_EMAIL,process.env.PAYPAL_PASSWORD,process.env.PAYPAL_SECRET);
  if (!req.user.ProfileID) {
    req.paymentStatus = false;
    req.paymentBillingPeriod = null;
    return next();
  }

  paypal.getSubscription(req.user.ProfileID, (err, data) => {
    if (!err) {
      // console.log(data);
      if (data.STATUS === "Active") {
        req.paymentStatus = true;
        req.paymentBillingPeriod = data.BILLINGPERIOD;
        return next();
      } else {
        req.paymentStatus = false;
        req.paymentBillingPeriod = null;
        return next();
      }
    } else {
      console.log(err);
      // return next();
      req.flash("error_msg", "Cannot get payment details. Please Try again later");
      res.redirect("/");
    }
  });
};

module.exports = { ensureAuthenticated, isSubscribed };
