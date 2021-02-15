const cors = require('cors');
const express = require('express');
const morgan = require('morgan')


const app = express();


app.set('port', process.env.PORT || 5000);


//Middlewares
app.use(cors());
app.use(morgan('dev'));


//Routes
app.use(require('./routes/routes'));


// Server

app.listen(app.get('port'), () => {
    console.log(`Server running on port ${app.get('port')}`);
});