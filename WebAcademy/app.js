require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const rememberMiddleware = require('./middlewares/rememberMiddleware');
const cors = require('cors');


// routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const shoppingCartRouter = require('./routes/shoppingCart');

// API routers
const apiUsersRouter = require('./routes/api/users');
const apiProductsRouter = require ('./routes/api/products');
const apiCategoriesRouter = require ('./routes/api/categories');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(session( {secret: 'Mensaje secreto'}));
app.use(rememberMiddleware);
app.use(cors())

// routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/shoppingCart', shoppingCartRouter);

// API routes
app.use('/api/users', apiUsersRouter);
app.use('/api/products', apiProductsRouter);
app.use('/api/categories', apiCategoriesRouter);

// locals
app.locals.webacademy = 'Web Academy';

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
