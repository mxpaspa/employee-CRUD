'use strict';

const express = require('express');
const employeeRoutes = require('./routes/employee');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const port = 30000;
const uri = 'mongodb://paspam:ibmapi12@ds115035.mlab.com:15035/ibm_api';

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', employeeRoutes);

// Fail over route
app.use(function(req, res) {
  res.status(404).send('Not found');
});

mongoose.connect(uri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.listen(port, function() {
  console.log(`Express started on http://localhost:${port}; press Ctrl-C to terminate.`);
});

module.exports = app;
