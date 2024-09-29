const express = require('express');
const router = express.Router();
const {
	ensureAuthenticated
} = require('./authentication')

const User = require('../models/user');
const Course = require('../models/course');

let month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

const maxCourses = 10;

router.get('/dashboard', ensureAuthenticated, (req, res) => {
	let {
		username
	} = req.user
	Course.getCoursesByTeacher(username, (err, courses) => {
		if (err) return res.send(err)
		if (courses) {
			let display_courses;
			let buttons;
			courses.forEach(async course => {
				let date = new Date()
				let diff = date.getTime() - new Date(course.thirtyViews.timeRecord || 0).getTime();
				if (diff > (30 * 24 * 60 * 60 * 1000)) {
					let newData = {};
					newData.thirtyViews = {
						timeRecord: new Date(new Date(course.thirtyViews.timeRecord || 0).getTime() + (30 * 24 * 60 * 60 * 1000)),
						views: 0
					}
					await Course.updateCourseById(course._id, newData, (err, doc) => {
						if (err) return res.send(err);
					})
				}
			})
			if (courses.length > maxCourses) {
				buttons = Math.ceil(courses.length / maxCourses)
				display_courses = courses.slice(0, maxCourses)
			} else {
				display_courses = courses
				buttons = 1
			}
			display_courses.forEach(course => {
				course.time = `${new Date(course.thirtyViews.timeRecord||0).getDate()} ${month[new Date(course.thirtyViews.timeRecord||0).getMonth()]}`
			})
			let searches = display_courses
			let user = req.user
			let page = 'teacher-dashboard'
			let params = {
				buttons: buttons,
				courses: searches.length ? searches : null,
				user: user,
				title: 'Instructor dashboard',
				style: page,
				js: page
			}
			res.render(page, params)
		} else {
			let user = req.user
			let page = 'teacher-dashboard'
			let params = {
				courses: null,
				user: user,
				title: 'Instructor dashboard',
				style: page,
				js: page
			}
			res.render(page, params)
		}
	})
})


router.get('/dashboard/views', (req, res) => {
	let {
		searchWord,
		page
	} = req.query;

	let str = searchWord
	let exp = new RegExp(RegExp.escape(str))

	const searchParam = {
		exp: exp,
		username: req.user.username
	}
	Course.getCoursesBySearchWord(searchParam, (err, course) => {
		if (err) return res.send(err)
		if (course) {
			let buttons;
			buttons = Math.ceil(course.length / maxCourses)
			if (page > buttons) {
				console.log(`pages : ${page} \n buttons : ${buttons}`);
				let data = {
					error: "Error: Bad request! Page not found.",
					courses: null,
				}
				return res.json({
					status: "failure",
					data: data
				})
			}
			let start = (page - 1) * maxCourses;
			let end = start + maxCourses
			if (course.length < end) {
				end = end + (end - course.length)
			}
			let courses = course.slice(start, end)
			let data = {
				error: "",
				courses: courses
			}
			return res.json({
				status: "success",
				data: data
			})
		} else {
			let user = req.user
			let page = 'teacher-dashboard'
			let params = {
				courses: null,
				user: user,
				title: 'Instructor dashboard',
				style: page,
				js: page
			}
			res.render(page, params)
		}
	})
})

router.get('/view/:username', ensureAuthenticated, (req, res) => {
	let {
		username
	} = req.params;
	let result;
	User.getUserProfileByUsername(username, (err, user) => {
		if (err) return res.send(err);
		if (!user) return res.send("No such user found");
		else {
			let page = 'student-details';
			result = user;
			Course.getCoursesByTeacher(username, (err, courses) => {
				if (err) return res.send(err);
				if (!courses.length) {
					console.log("Nothing found")
					result.courses = null;
					let params = {
						result: result,
						user: req.user,
						title: 'User profile',
						style: page,
						js: page
					}
					params.result.joinDate = `${month[user.joined.getMonth()]} ${user.joined.getFullYear()}`;

					console.log(params.result.joinDate)
					return res.render(page, params)
				} else {
					console.log("Courses found");
					result.courses = courses;
					let params = {
						result: result,
						user: req.user,
						title: 'User profile',
						style: page,
						js: page
					}
					params.result.joinDate = `${month[user.joined.getMonth()]} ${user.joined.getFullYear()}`;

					console.log(params.result.joinDate)
					return res.render(page, params)
				}
			})
		}
	})
})

module.exports = router;