const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        email: true,
        required: true
    },
    password: {
        type: String,
        password: true,
        select: false,
        required: true
    },
    bio: {
        type: String
    },
    title: {
        type: String
    },
    joined: {
        type: Date
    },
    location: {
        type: String
    },
    imageURL: {
        type: String
    },
    courses: {
        type: Array
    },
    playVideos: {
        type: Array
    },
    ProfileID: {
        type: String,
        default: null
    },
    phone: {
        type: String,
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

module.exports.createUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.getUserByEmail = (email, callback) => {
    let query = { email: email };
    User.findOne(query).select('+password').exec(callback);
}

module.exports.getUserByUsername = (username, callback) => {
    let query = { username: username };
    User.findOne(query).select('+password').exec(callback);
}

module.exports.getUsersBySearchWord = (search, callback) => {
    let query = { username: search };
    User.find(query, { _id: 0, username: 1, bio: 1 }).sort({ _id: 1 }).exec(callback);
}

module.exports.getUserProfileByUsername = (search, callback) => {
    let query = { username: search };
    User.findOne(query, { _id: 0, username: 1, bio: 1, joined: 1, title: 1, location: 1, imageURL: 1 }).exec(callback);
}

module.exports.getUserByID = (id, callback) => {
    User.findById(id, callback);
}

module.exports.updateUserById = (id, newData, callback) => {
    User.findByIdAndUpdate(id, newData, callback)
}

module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    })
}

module.exports.addCourse = (id, courseId, callback) => {
    User.findByIdAndUpdate(id, {
        $push: {
            courses: courseId
        }
    }).exec(callback);
}
