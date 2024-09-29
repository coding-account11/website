require("dotenv").config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
var telesign = require('telesign').setup({
  customerId: 'AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE',
  apiKey: 'your/APIKey=='
});

mongoose.connect(`${process.env.MONGO_URL}`, {

  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(
  () => { console.log("DB connection Successful"); },
  err => { console.error(err) }
);

mongoose.set('useCreateIndex', true);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(express.static(path.join(__dirname, "public")))

// EJS
app.set('views', path.join(__dirname, '/views'))
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));;

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


app.use(express.static(path.join(__dirname, 'build', 'index.html')));


// Routes
app.get('/auth', (req, res) => {
  res.redirect(path.join(__dirname, 'build', 'index.html'));
});

app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/pages', require('./routes/pages.js'));
app.use('/profiles', require('./routes/profiles.js'));
app.use('/courses', require('./routes/courses.js'));
app.use('/payment', require('./routes/payment.js'));
app.use('/phoneverify', require('./routes/phone.js'));

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
  res.render('404', { title: null });
});


const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
