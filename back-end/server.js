
const express = require('express');
const cors = require('cors')
const corsOptions = require('./config/corsOptions');
const oracledb = require('oracledb')
require('dotenv').config();
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const PORT = process.env.PORT || 5000;
const dbConn = require('./config/dbConn');
const verifyJWT = require('./middleware/verifyJWT');

const app = express();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());


app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/users', require('./routes/api/users'));


app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.send("404 Not Found");
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.listen(PORT, () => {
    console.log(`listen to port ${PORT}`);
})

