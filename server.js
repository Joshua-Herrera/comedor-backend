const mongoose = require('mongoose');
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'prod') {
  process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('Uncaught Exeption, shutting down...');
    process.exit(1);
  });
}

//Server configuration
dotenv.config({ path: './config.env' });

console.log('env: ' + process.env.NODE_ENV);

//Connection to MongoDB
mongoose
  .connect(process.env.ATLASDATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful');
  });

const app = require('./app');

//server start
const server = app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandle rejection, shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
