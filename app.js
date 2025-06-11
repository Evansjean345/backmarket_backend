require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userRoute = require('./routes/userRoutes');
var articleRoute = require('./routes/articleRoutes');
var orderRoute = require('./routes/orderRoutes');
var orderRoute = require('./routes/orderRoutes');
var shopRoute = require('./routes/shopRoutes');
var categoriesRoute = require('./routes/categoriesRoutes');
// les routes de l'espace administration //
var adminArticlesRoute = require("./routes/administration/articlesRoutes")
var adminOrdersRoute = require("./routes/administration/ordersRoute")
var adminShopsRoute = require("./routes/administration/shopsRoute")


const uploadRoutes = require('./routes/uploadRoutes');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.DATABASE_URI)
.then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/articles',articleRoute);
app.use('/api/users', userRoute);
app.use('/api/orders', orderRoute);
app.use('/api/shops', shopRoute);
app.use('/api/uploads-files', uploadRoutes);
app.use('/api/categories', categoriesRoute);

app.use('/api/administration/articles', adminArticlesRoute)
app.use('/api/administration/orders', adminOrdersRoute)
app.use('/api/administration/shops', adminShopsRoute)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
