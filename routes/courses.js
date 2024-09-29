const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { ensureAuthenticated, isSubscribed } = require("./authentication");
const userModel = require("../models/user");
var LocalStorage = require("node-localstorage").LocalStorage,
  localStorage = new LocalStorage("./scratch");

router.use(express.json());

const User = require("../models/user");
const Course = require("../models/course");

router.post(
  "/addCourse",
  ensureAuthenticated,
  isSubscribed,
  [
    check("title")
      .not()
      .isEmpty()
      .withMessage("Title is required")
      .bail()
      .matches(/[a-zA-Z0-9,\-\._]+/)
      .withMessage("Can only contain letters numbers or -, ., _ or comma"),
    check("description")
      .not()
      .isEmpty()
      .withMessage("Description is required")
      .bail()
      .matches(/[a-zA-Z0-9,\-\._\&!@#%^\\\*\(\)\{\}\[\]:'"/\+\=]+/)
      .withMessage("Make sure not to add non-speach related characters"),
    check("category").not().isEmpty().withMessage("Category is required"),
    // check("picture")
    //   .not()
    //   .isEmpty()
    //   .withMessage("Course image is required"),
    // check("videos")
    //   .not()
    //   .isEmpty()
    //   .withMessage("videos are required"),
  ],
  (req, res) => {
    console.log("in it", req.paymentStatus, req.user);
    // if (!req.paymentStatus) {
    //     req.flash(
    //         "error_msg",
    //         "Please subscribe to add course!"
    //     );
    //     return res.redirect("/pages/pricing-table-page");
    // }
    let errors = validationResult(req);
    let titleErr = null,
      descriptionErr = null,
      // pictureErr = null,
      categoryErr = null;
    // videosErr = null;

    if (errors.errors.length) {
      errors.errors.forEach((error) => {
        if (error.param === "title") titleErr = error;
        if (error.param === "description") descriptionErr = error;
        // if (error.param === "picture") pictureErr = error;
        if (error.param === "category") categoryErr = error;
        // if (error.param === "videos") videosErr = error;
      });
      let params = {
        status: "failure",
        failure: "input",
        title: {
          value: req.body.title,
          error: titleErr,
        },
        description: {
          value: req.body.description,
          error: descriptionErr,
        },
        // picture: {
        //   value: req.body.picture,
        //   error: pictureErr,
        // },
        category: {
          value: req.body.category,
          error: categoryErr,
        },
        // videos: {
        //   value: req.body.videos,
        //   error: videosErr,
        // },
      };
      return res.json(params);
    } else {
      let currDate = new Date();
      let newTeacher = {
        username: req.user.username,
        bio: req.user.bio,
      };
      let newCourse = new Course({
        title: req.body.title,
        description: req.body.description,
        // picture: req.body.picture,
        category: req.body.category,
        // videos: req.body.videos,
        created: currDate,
        teacher: newTeacher,
        views: 0,
        thirtyViews: {
          timeRecord: Date.now(),
          views: 0,
        },
      });
      console.log("New Course", newCourse);
      Course.createCourse(newCourse, (err, course) => {
        if (err) {
          let params = {
            status: "failure",
            failure: "database",
            title: {
              value: req.body.title,
              error: null,
            },
            description: {
              value: req.body.description,
              error: null,
            },
            // picture: {
            //   value: req.body.picture,
            //   error: null,
            // },
            category: {
              value: req.body.category,
              error: null,
            },
            // videos: {
            //   value: req.body.videos,
            //   error: null,
            // },
          };
          return res.json(params);
        }
        console.log("Success");
        User.addCourse(req.user._id, course._id, (err, upUser) => {
          if (err) throw err;
        });
        let params = {
          status: "success",
          failure: null,
          title: {
            value: req.body.title,
            error: null,
          },
          description: {
            value: req.body.description,
            error: null,
          },
          // picture: {
          //   value: req.body.picture,
          //   error: null,
          // },
          category: {
            value: req.body.category,
            error: null,
          },
          // videos: {
          //   value: req.body.videos,
          //   error: null,
          // },
        };
        return res.json(params);
      });
    }
  }
);

router.get("/view/:id", ensureAuthenticated, isSubscribed, async (req, res) => {
  let videosInOneMonth = 0;
  let date = new Date();
  let obj = {
    month: date.getMonth(),
    year: date.getFullYear(),
  };
  let email = localStorage.getItem("email");
  const { playVideos } = await userModel.findOne({ email });
  playVideos.forEach((item) => {
    if (item.month === date.getMonth() && item.year === date.getFullYear()) {
      videosInOneMonth = videosInOneMonth + 1;
    }
  });
  // =============================================
  let { id } = req.params;
  Course.getCourseById(id, async (err, course) => {
    if (err) throw err;
    if (course) {
      // console.log(course.thirtyViews.timeRecord);
      let date = new Date();
      let diff =
        date.getTime() - new Date(course.thirtyViews.timeRecord || 0).getTime();
      let newData = {};
      if (req.user.username !== course.teacher.username) {
        if (diff > 30 * 24 * 60 * 60 * 1000) {
          newData.views = course.views + 1;
          newData.thirtyViews = {
            timeRecord: new Date(
              course.thirtyViews.timeRecord.getTime() + 30 * 24 * 60 * 60 * 1000
            ),
            views: 1,
          };
          Course.updateCourseById(course._id, newData, (err, doc) => {
            if (err) throw err;
          });
        } else {
          newData.views = course.views + 1;
          newData.thirtyViews = {
            timeRecord: course.thirtyViews.timeRecord,
            views: course.thirtyViews.views + 1,
          };
          Course.updateCourseById(course._id, newData, (err, doc) => {
            if (err) throw err;
          });
        }
      }
      let user = req.user;
      let page = "course-view";
      let params = {
        result: course,
        user: user,
        title: "View Course",
        style: page,
        js: page,
        isSubscribed: req.paymentStatus,
        views: videosInOneMonth,
      };
      if (params.isSubscribed === false && videosInOneMonth < 5) {
        await userModel.findOneAndUpdate(
          { email: email },
          { $push: { playVideos: obj } },
          { new: true }
        );
      } else if (isSubscribed === true) {
        await userModel.findOneAndUpdate(
          { email: email },
          { $push: { playVideos: obj } },
          { new: true }
        );
      }
      return res.render(page, params);
    } else {
      let user = req.user;
      let page = "course-view";
      let params = {
        result: null,
        user: user,
        title: "View Course",
        style: page,
        js: page,
      };
      return res.render(page, params);
    }
  });
});

module.exports = router;
