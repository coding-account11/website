const express = require('express');
const router = express.Router();
const { ensureAuthenticated, isSubscribed } = require('./authentication')
require("dotenv").config();

router.get('/login-page', (req, res) => {
    if (req.user) {
        req.flash('error_msg', 'You are logged in already. Logout first.')
        res.redirect('/')
    }
    else {
        let user = req.user
        let page = 'login'
        let params = {
            user: user,
            title: 'Login',
            style: page,
            js: page
        }
        res.render(page, params)
    }
})

router.get('/phone-login', (req, res) => {
    if (req.user) {
        req.flash('error_msg', 'You are logged in already. Logout first.')
        res.redirect('/')
    }
    else {
        let user = req.user
        let page = 'phone-login'
        let params = {
            user: user,
            title: 'Login',
            style: page,
            js: page
        }
        res.render(page, params)
    }
})

router.get('/register-page', (req, res) => {
    if (req.user) {
        req.flash('error_msg', 'You are logged in already. Logout first.')
        res.redirect('/')
    }
    else {
        let page = 'register'
        let params = {
            title: 'Create Account',
            style: page,
            js: page,
            first: {
                value: "",
                error: null
            },
            second: {
                value: "",
                error: null
            },
            third: {
                value: "",
                error: null
            },
            fourth: {
                value: "",
                error: null
            }
        }
        res.render(page, params)
    }
})
router.get('/otp-page', (req, res) => {
    if (req.user) {
        req.flash('error_msg', 'You are logged in already. Logout first.')
        res.redirect('/')
    }
    else {
        let page = 'phone-login'
        let params = {
            title: 'Create Account',
            style: page,
            js: page,
            first: {
                value: "",
                error: null
            },
            second: {
                value: "",
                error: null
            },
            third: {
                value: "",
                error: null
            },
            fourth: {
                value: "",
                error: null
            }
        }
        res.render(page, params)
    }
})
router.get('/about-page', ensureAuthenticated, (req, res) => {
    let user = req.user
    let page = 'about'
    let params = {
        user: user,
        title: 'About us',
        style: page,
        js: page
    }
    res.render(page, params)
})

router.get('/pricing-table-page', ensureAuthenticated, isSubscribed, (req, res) => {
    console.log(req.paymentStatus, req.paymentBillingPeriod);
    let user = req.user
    let page = 'pricing-table'
    let params = {
        user: user,
        title: 'Pricing',
        style: page,
        monthlyCost: process.env.MONTHLY_PLAN_COST,
        yearlyCost: process.env.YEARLY_PLAN_COST,
        isSubscribed: req.paymentStatus,
        period: req.paymentBillingPeriod || null,
        js: page
    }
    res.render(page, params)
})

router.get('/message-page', ensureAuthenticated, (req, res) => {
    let user = req.user
    let page = 'message'
    let params = {
        user: user,
        title: 'Inbox',
        style: page,
        js: page
    }
    res.render(page, params)
})

router.get('/submit-course-page', ensureAuthenticated, isSubscribed, (req, res) => {
    let user = req.user
    let page = 'submit-course'
    let params = {
        user: user,
        title: 'Add new course',
        isSubscribed:req.paymentStatus,
        isSubscribed: true,
        style: page,
        js: page
    }
    res.render(page, params)
})

router.get('/friends-page', ensureAuthenticated, (req, res) => {
    let user = req.user
    let page = 'friends'
    let params = {
        user: user,
        title: 'Friends',
        style: page,
        js: page
    }
    res.render(page, params)
})

router.get('/saved-page', ensureAuthenticated, (req, res) => {
    let user = req.user
    let page = 'saved'
    let params = {
        user: user,
        title: 'Saved courses',
        style: page,
        js: page
    }
    res.render(page, params)
})

router.get('/dashboard-submit-course-page', ensureAuthenticated, isSubscribed, (req, res) => {
    let user = req.user
    let page = 'dashboard-submit-course'
    let params = {
        user: user,
        title: 'Add course',
        style: page,
        isSubscribed: req.paymentStatus,
        js: page
    }
    res.render(page, params)
})

router.get('/course-details-page', ensureAuthenticated, (req, res) => {
    let user = req.user
    let page = 'courseDetails'
    let params = {
        user: user,
        title: 'Course details',
        style: page,
        js: page
    }
    res.render(page, params)
})

router.get('/teacher-details-page', ensureAuthenticated, (req, res) => {
    let user = req.user
    let page = 'teacher-details'
    let params = {
        user: user,
        title: 'Teacher details',
        style: page,
        js: page
    }
    res.render(page, params)
})

router.get('/student-details-page', ensureAuthenticated, (req, res) => {
    let user = req.user
    if (req.user) {
        user.joined = `${month[req.user.joined.getMonth()]} ${req.user.joined.getFullYear()}`
    }
    if (!user) {
        user = {
            username: "Ansari476",
            joined: "June 2018",
            imageURL: "/images/img2.jpg",
            bio: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptas laudantium, ipsum porro consequatur aperiam maxime veritatis itaque dolorum molestias odit doloremque. Doloribus maiores tempora perspiciatis eveniet vel suscipit, labore praesentium?",
            location: "America",
            title: "Web developer",
        }
    }
    let page = 'student-details'
    let params = {
        user: user,
        title: 'Student details',
        style: page,
        js: page
    }
    res.render(page, params)
})

router.get('/personal-details-page', ensureAuthenticated, isSubscribed, (req, res) => {
    let user = req.user
    let result = {
        username: "Ansari476",
        imageURL: "/images/img2.jpg",
        bio: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptas laudantium, ipsum porro consequatur aperiam maxime veritatis itaque dolorum molestias odit doloremque. Doloribus maiores tempora perspiciatis eveniet vel suscipit, labore praesentium?",
        location: "America",
        title: "Web developer",
    }
    if (req.user) {
        result.joinDate = `${month[req.user.joined.getMonth()]} ${req.user.joined.getFullYear()}`
    }
    let page = 'personal-details'
    let params = {
        result: result,
        user: user,
        isSubscribed: req.paymentStatus,
        title: 'Profile info',
        style: page,
        js: page
    }
    return res.render(page, params)
})

router.get('/course-grid-page', ensureAuthenticated, (req, res) => {
    let user = req.user
    let page = 'course-grid'
    let params = {
        user: user,
        title: 'Courses',
        style: page,
        js: page
    }
    res.render(page, params)
})

router.get('/recover-page', ensureAuthenticated, (req, res) => {
    let user = req.user
    let page = 'recover'
    let params = {
        user: user,
        title: 'Recover password',
        style: page,
        js: page
    }
    res.render(page, params)
})

router.get('/search-results-user', ensureAuthenticated, (req, res) => {
    let user = req.user
    let page = 'search-results-user'
    let params = {
        user: user,
        title: 'Search results',
        style: page,
        js: page
    }
    res.render(page, params)
})

router.get('/search-results-course', ensureAuthenticated, (req, res) => {
    let user = req.user
    let page = 'search-results-user'
    let params = {
        user: user,
        title: 'Search results',
        style: page,
        js: page
    }
    res.render(page, params)
})

router.get('/course-view', ensureAuthenticated, (req, res) => {
    let user = req.user
    let page = 'course-view'
    let params = {
        user: user,
        title: 'Course view',
        style: page,
        js: page
    }
    res.render(page, params)
})




// Here Prices Section is routed

router.get('/prices-page', ensureAuthenticated, (req, res) => {
    let user = req.user
    let page = 'prices'
    let params = {
        user: user,
        title: 'prices',
        style: page,
        js: page
    }
    res.render(page, params)
})

module.exports = router;
