const cors = require('cors');
const express = require('express');
const morgan = require('morgan')

require('dotenv').config();

const app = express();

const { mongoose } = require('./db');


app.set('port', process.env.PORT);


//Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));


//Routes
app.use(require('./routes/routes'));


// Server

app.listen(app.get('port'), () => {
    console.log(`Server running on port ${app.get('port')}`);
});


module.exports = app;