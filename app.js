const compression = require('compression');
const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const xss = require('xss-clean');
const menuRouter = require('./routes/menuRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const billRouter = require('./routes/billingRoutes');
const productsRouter = require('./routes/productRoutes');
const expensesRouter = require('./routes/expensesRoutes');
const paramsRouter = require('./routes/paramsRoutes');
const paymentRouter = require('./routes/paymentRoutes');
const statsRouter = require('./routes/statsRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const app = express();

//Middlewares
app.use(compression());
//allow OPTIONS on all resources
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-credentials', 'true');
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, DELETE, PATCH');
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.use(express.json());
app.use(express.static('public'));

//Limiting the amount of calls to the API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour',
});
// app.use('/api', limiter);

//Body parser
app.use(express.json({ limit: '10kb' }));

//Data sanitization agains NoSQL injection
app.use(mongoSanitize());

// Data sanitization
app.use(xss());

//Prevent Parameter polution
app.use(
  hpp({
    whitelist: [],
  })
);

//Routes
app.use('/api/v1/menu', menuRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bills', billRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/expenses', expensesRouter);
app.use('/api/v1/stats', statsRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/params', paramsRouter);
//Handler for not valid URLs/routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Global error catcher
app.use(globalErrorHandler);

module.exports = app;
