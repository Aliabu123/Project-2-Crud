// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var tvshowRouter = require('./routes/tvshows');
// var usersRouter = require('./routes/users');
// 
// const{ connectToDatabase }  = require('./config/database')

// var app = express();
// connectToDatabase()

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', tvshowRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;


const express = require("express");
const bodyParser = require("body-parser");
const tvshowRoutes = require("./routes/tvshowRoutes");
require("dotenv").config();
require("./config/db")();

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/public", express.static("public"));

app.use("/", tvshowRoutes);

app.use((req, res, next) => {
  const error = new Error("Page not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render("error", { message: error.message });
});

const HOST = process.env.HOST;
const PORT = process.env.PORT;

app.listen(PORT, HOST, () => {
  console.log(`App running on: http://${HOST}:${PORT}`);
});




