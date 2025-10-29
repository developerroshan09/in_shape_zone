const express = require('express');
const dotenv=require('dotenv');
const morgan=require('morgan');
const bodyparser=require('body-parser');
const path=require('path');
const foodRoutes = require('./server/routes/foodRoutes');

const bodyParser = require("body-parser");
const connectDB = require("./server/database/connection");

// creating an express application
const app = express();
app.use(express.json());

// loading environment variables from 'config.env' file
dotenv.config({ path: 'config.env'});

// Setting up the port for the server
const PORT = process.env.PORT || 8080

// Logging request with morgan
app.use(morgan('tiny'));

// Establishing a connection to the MongoDB database
connectDB();

// Parsing incoming request bodies using body-parser middleware
app.use(bodyParser.urlencoded( { extended: true}));

// Loading routes from a separate file
app.use('/', require('./server/routes/router'));
app.use('/', require('./server/routes/auth'));
app.use('/', require('./server/routes/foodRoutes'));

// Starting the server and listening on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
