const express = require('express');
const { ensureAuthenticated } = require('./authentication');
const router = express.Router();
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
const Course = require('../models/course');
const SubscriptionRouter = require('./payment');

const maxUsers = 36
const maxCourses = 24

router.get('/',
    (req, res) => {
        // console.log(req.query);
        let user = req.user
        let page = 'index'
        let params = {
            user: user,
            title: 'Home',
            style: page,
            js: page
        }
        res.render(page, params)
    }
);
router.get('/otp-page',
    (req, res) => {
        let user = req.user
        let page = 'phone-login'
        let params = {
            user: user,
            title: 'Home',
            style: page,
            js: page
        }
        res.render(page, params)
    }
);

router.post('/search', ensureAuthenticated, (req, res) => {
    if (req.body.user) {
        console.log(req.body, '------------------')
        let str = req.body.search
        let exp = new RegExp(RegExp.escape(str))
        console.log(exp);
        User.getUsersBySearchWord(exp, (err, users) => {
            console.log(users);
            if (err) throw err
            if (!users) {
                let user = req.user
                let page = 'search-results-user'
                let params = {
                    searches: null,
                    searchWord: req.body.search,
                    user: user,
                    title: 'Not found',
                    style: page,
                    js: page
                }
                res.render(page, params)
            } else {
                console.log(`This is my users' length : ${users.length}`, 'line number 65 index.js')
                let display_users;
                let buttons;
                if (users.length > maxUsers) {
                    buttons = Math.ceil(users.length / maxUsers)
                    display_users = users.slice(0, maxUsers)
                } else {
                    display_users = users
                    buttons = 1
                }
                let searches = display_users
                let user = req.user
                let page = 'search-results-user'
                let params = {
                    buttons: buttons,
                    searches: searches.length ? searches : null,
                    searchWord: req.body.search,
                    user: user,
                    title: 'Search Results for users',
                    style: page,
                    js: page
                }
                res.render(page, params)
            }
        })
    }
    else if (req.body.video) {
        let str = req.body.search
        let exp = new RegExp(RegExp.escape(str))
        Course.getAllCoursesBySearchWord(exp, (err, courses) => {
            console.log(`This is my video' length : ${courses.length}`, 'line number 95')
            if (err) throw err
            if (!courses) {
                let user = req.user
                let page = 'search-results-course'
                let params = {
                    searches: null,
                    searchWord: req.body.search,
                    user: user,
                    title: 'Not found',
                    style: page,
                    js: page
                }
                res.render(page, params)
            } else {
                let display_courses;
                let buttons;
                if (courses.length > maxCourses) {
                    buttons = Math.ceil(courses.length / maxCourses)
                    display_courses = courses.slice(0, maxCourses)
                } else {
                    display_courses = courses
                    buttons = 1
                }
                let searches = display_courses
                let user = req.user
                let page = 'search-results-course'
                let params = {
                    buttons: buttons,
                    searches: searches.length ? searches : null,
                    searchWord: req.body.search,
                    user: user,
                    title: 'Search Results for courses',
                    style: page,
                    js: page
                }
                res.render(page, params)
            }
        })
    }
    else {
        res.render('404')
    }
})

router.get('/search/users/:searchWord/:page', ensureAuthenticated, (req, res) => {
    let { searchWord, page } = req.params;
    let str = searchWord
    let exp = new RegExp(RegExp.escape(str))
    User.getUsersBySearchWord(exp, (err, users) => {
        // console.log(users)
        if (err) {
            let data = {
                error: "Error: Database did not respond!",
                searches: null,
            }
            return res.json({ status: "failure", data: data })
        }
        if (!users) {
            let data = {
                error: "No matches found!",
                searches: null,
            }
            return res.json({ status: "failure", data: data })
        } else {
            let buttons;
            buttons = Math.ceil(users.length / maxUsers)
            if (page > buttons) {
                console.log(`pages : ${page} \n buttons : ${buttons}`);
                let data = {
                    error: "Error: Bad request! Page not found.",
                    searches: null,
                }
                return res.json({ status: "failure", data: data })
            }
            let start = (page - 1) * maxUsers;
            let end = start + maxUsers
            if (users.length < end) {
                end = end + (end - users.length)
            }
            let searches = users.slice(start, end)
            let data = {
                error: "",
                searches: searches
            }
            return res.json({ status: "success", data: data })
        }
    })
})

router.get('/search/courses', ensureAuthenticated, (req, res) => {
    let { page } = req.query;
    let searchWord=req.query.searchWord.trim()
    let str = searchWord
    let exp = new RegExp(RegExp.escape(str))
    Course.getAllCoursesBySearchWord(exp, (err, courses) => {
        if (err) {
            let data = {
                error: "Error: Database did not respond!",
                searches: null,
            }
            return res.json({ status: "failure", data: data })
        }
        if (!courses) {
            let data = {
                error: "No matches found!",
                searches: null,
            }
            return res.json({ status: "failure", data: data })
        } else {
            let buttons;
            buttons = Math.ceil(courses.length / maxCourses)
            if (page > buttons) {
                console.log(`pages : ${page} \n buttons : ${buttons}`);
                let data = {
                    error: "Error: Bad request! Page not found.",
                    searches: null,
                }
                return res.json({ status: "failure", data: data })
            }
            let start = (page - 1) * maxCourses;
            let end = start + maxCourses
            if (courses.length < end) {
                end = end + (end - courses.length)
            }
            let searches = courses.slice(start, end)
            let data = {
                error: "",
                searches: searches
            }
            return res.json({ status: "success", data: data })
        }
    })
})

router.get('/add-users', ensureAuthenticated, (req, res) => {
    for (i = 0; i < 500; i++) {
        let newUser = new User({
            username: `dbasd_${Math.floor(i / 10)}${i % 10}`,
            email: 'reqemail@monkey.com',
            password: 'req.body',
            bio: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
        });

        User.createUser(newUser, (err, user) => {
            if (err) throw err;
            console.log(user);
        });
    }
    res.send("done")
})

router.get('/add-courses/:id', (req, res) => {
    return res.send("done")
})

router.get('/subscribe', SubscriptionRouter)

RegExp.escape = function (string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
};

module.exports = router;
