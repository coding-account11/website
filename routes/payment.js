require("dotenv").config();
const User = require("../models/user");
const router = require("express").Router();
const { ensureAuthenticated } = require("./authentication");
const paypal = require('../config/paypal');

router.post("/", ensureAuthenticated, (req, res) => {
  // console.log("payment post hit");
  const subscriptionType = req.body.subscriptionType;
  paypal.authenticate(
    {
      RETURNURL:
        subscriptionType === "M"
          ? `${process.env.BASE_URL}/payment/monthly-subscription`
          : `${process.env.BASE_URL}/payment/yearly-subscription`,
      CANCELURL: "https://localhost/subscription/fail",
      PAYMENTREQUEST_0_AMT:
        subscriptionType === "M"
          ? process.env.MONTHLY_PLAN_COST
          : process.env.YEARLY_PLAN_COST,
      L_BILLINGAGREEMENTDESCRIPTION0: "A description of this subscription",
    },
    (err, data, url) => {
      if (!err) {
        res.redirect(302, url);
      }
    }
  );
});

router.get("/monthly-subscription", ensureAuthenticated, (req, res) => {
  // console.log("monthly get hit");
  const { token, PayerID } = req.query;
  paypal.createSubscription(
    token,
    PayerID,
    {
      AMT: process.env.MONTHLY_PLAN_COST,
      DESC: "A description of this subscription",
      BILLINGPERIOD: "Month",
      BILLINGFREQUENCY: 1,
    },
    async (err, data) => {
      if (!err) {
        User.updateUserById(req.user.id, { ProfileID: data.PROFILEID }, () => {
          // console.log("Monthly Subscription Activated");
          req.flash("success_msg", "Your Subscription Activated Successfully!");
          res.redirect("/");
        });
      }
      else {
        console.error(err, "59");
        req.flash(
          "error_msg",
          "Your Subscription Could Not Active Try Again Later!"
        );
        res.redirect("/pages/pricing-table-page");
      }

    }
  );
});

router.get("/yearly-subscription", ensureAuthenticated, (req, res) => {
  const { token, PayerID } = res.query;
  paypal.createSubscription(
    token,
    PayerID,
    {
      AMT: process.env.YEARLY_PLAN_COST,
      DESC: "A description of this subscription",
      BILLINGPERIOD: "Year",
      BILLINGFREQUENCY: 1,
    },
    async (err, data) => {
      if (!err) {
        User.updateUserById(req.user.id, { ProfileID: data.PROFILEID }, () => {
          // console.log("Yearly Subscription Activated");
          req.flash("success_msg", "Your Subscription Activated Successfully!");
          res.redirect("/");
        });
        // res.send("You are now one of our customers!");
      }
      else {
        console.error(err, '92');
        req.flash(
          "error_msg",
          "Your Subscription Could Not Active Try Again Later!"
        );
        res.redirect("/pages/pricing-table-page");
      }
    }
  );
});

router.get("/subscription-details", ensureAuthenticated, (req, res) => {
  paypal.getSubscription(req.user.ProfileID, (err, data) => {
    if (!err) {
      // console.log(data);
      //   res.send(data);
      if ((data.STATUS = "Active")) {
        req.flash("success_msg", "Your Subscription Activated Successfully!");
      } else {
        req.flash(
          "error_msg",
          "Could not get subscription details!"
        );
      }

      res.redirect("/pages/pricing-table-page");
    }
  });
});

router.get("/subscription-cancel", ensureAuthenticated, (req, res) => {
  paypal.modifySubscription(req.user.ProfileID, "Cancel", (err, data) => {
    if (!err) {
      // console.log(data);
      User.updateUserById(req.user.id, { ProfileID: "" }, () => {
        // console.log("Yearly Subscription Activated");
        req.flash("error_msg", "Your Subscription Cancelled Successfully!");
        res.redirect("/pages/pricing-table-page");
      });
    }
  });
});

module.exports = router;
