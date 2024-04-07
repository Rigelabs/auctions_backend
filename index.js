const express = require('express');
const helmet = require('helmet');
const {createServer} = require('http');
const cors = require('cors');
const env = require('dotenv');
const https = require("https");
const fs = require('fs');

const path = require('path');
const logger = require('./middlewares/logger');




const process = require('process');
const { default: mongoose } = require('mongoose');
const send_subsriber_id = require('./middlewares/utility');


const app = express()
// Cross-origin resource sharing (CORS) is a mechanism that allows 
//restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served
const whitelist = ['', 'http://localhost:3000']
app.use(cors({
  origin: whitelist,
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // For legacy browser support
}));


//initialize bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//environment variable
env.config();


//Helmet helps you secure your Express apps by setting various HTTP headers.
//The top-level helmet function is a wrapper around 15 smaller middlewares, 11 of which are enabled by default.
app.use(helmet());


const PORT = process.env.PORT || 7000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port  ${PORT}`)
  logger.info(`Waridi backend Server running in ${process.env.NODE_ENV} on port  ${PORT}`)
})

//setting up db

const db = process.env.MONGO_URI;

mongoose.connect(db, {})
  .then(connected => {
    logger.info('Eris backend Mongo DB connected')
    console.log('Connected to DB')
  })
  .catch(error => {
    logger.error(`Eris backend Mongo DB error, ${error}`)
    console.log(error)
  })


app.get('/', function (req, res) {
  res.send('Restricted area!')

})
//generate subscriber id
send_subsriber_id()

// Capture 500 errors
app.use((err, req, res, next) => {
  res.status(500).send('Server Error!');

})

// Capture 404 erors
app.use((req, res, next) => {
  res.status(404).send("PAGE NOT FOUND");

})




//uncaughtException to crash the nodejs process
process.on('unhandledRejection', (err, origin) => {
  logger.error('Unhandled rejection at ', origin, `reason: ${err}`)
  console.log('Unhandled rejection at ', origin, `reason: ${err}`)

})
//The 'rejectionHandled' event is emitted whenever a Promise has been rejected
// and an error handler was attached to it (using promise.catch(), for example) later than one turn of the Node.js event loop.
process.on('rejectionHandled', (err, origin) => {
  logger.error('RejectionHandled at ', origin, `reason: ${err}`)
  console.log('RejectionHandled at ', origin, `reason: ${err}`)

})
//The 'exit' event is emitted when the Node.js process is about to exit as a result of either:
//The process.exit() method being called explicitly;
//The Node.js event loop no longer having any additional work to perform.
process.on('exit', (err, origin) => {
  logger.error('Process Exited !! ', origin, `reason: ${err}`)
  console.log('Process Exited !! ', origin, `reason: ${err}`)

})  
