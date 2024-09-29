const mongoose = require("mongoose");

let CourseSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    email: true,
    required: true,
  },
  videos: {
    type: Array
  },
  picture: {
    type: String
  },
  category: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
  },
  teacher: {
    type: Object,
  },
  views: {
    type: Number,
  },
  thirtyViews: {
    type: Object,
  },
});

const Course = mongoose.model("course", CourseSchema);

module.exports = Course;

module.exports.createCourse = (newCourse, callback) => {
  newCourse.save(callback);
};

module.exports.getCoursesBySearchWord = (search, callback) => {
  let query = {
    title: search.exp,
    "teacher.username": search.username,
  };
  Course.find(query, callback);
};
module.exports.getAllCoursesBySearchWord = (search, callback) => {
  let query = { title: search };
  Course.find(query, callback);
};

module.exports.getCoursesByTeacher = (username, callback) => {
  let query = { "teacher.username": username };
  Course.find(query, callback);
};

module.exports.getCoursesByTitle = (title, callback) => {
  let query = { title: title };
  Course.findOne(query, callback);
};

module.exports.getCourseById = (id, callback) => {
  if (id.startsWith("Video")) {
    id = 'ffffffffffff112121212121'
  }
  Course.findById(id, callback);
};

module.exports.updateCourseById = (id, newData, callback) => {
  Course.findByIdAndUpdate(id, newData, callback);
};
