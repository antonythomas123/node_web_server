const express = require('express');
const app = express();
const path = require('path');

//third party middleware
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

//const logEvents = require('./middleware/log');
const { logger, logEvents } = require('./middleware/log');

const errorHandler = require('./middleware/errorHandler');

const PORT = process.env.PORT || 3500;  //port for our web server

//custom middleware's
app.use(logger);

//third party middleware
app.use(cors(corsOptions));

//built-in middleware's
// to handle urlencoded data, in other words form data
//'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

//buit-in middleware for json
app.use(express.json());

//built-in middleware for static files
app.use('/',express.static(path.join(__dirname, '/public')));

//express route for static file
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/employees', require('./routes/api/employees'));


app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    else if(req.accepts('json')){
        res.json({error: "404 Not Found"});
    }else{
        res.type('txt').send("404 Not Found");
    }
    
})

app.use(errorHandler);

//server listening for request
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});