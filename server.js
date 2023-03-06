const express = require('express');
const app = express();
const path = require('path');

//third party middleware
const cors = require('cors');

//const logEvents = require('./middleware/log');
const { logger, logEvents } = require('./middleware/log');

const errorHandler = require('./middleware/errorHandler');

const PORT = process.env.PORT || 3500;  //port for our web server

//custom middleware's

// app.use((req, res, next) => {
//     logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`,'reqLogs.txt')
//     console.log(`${req.method} ${req.path}`);
//     next();
// })

//                  OR

app.use(logger);

//third party middleware
const whitelist=['https://www.yoursite.com','http://127.0.0.1:5500','http://localhost:3500']; //whitelist that the backend will not show cors
const corsOptions = {
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin)!== -1 || !origin){
            callback(null,true)
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));

//built-in middleware's
// to handle urlencoded data, in other words form data
//'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

//buit-in middleware for json
app.use(express.json());

//built-in middleware for static files
app.use(express.static(path.join(__dirname, '/public')));


//Express route
app.get('/', (req, res) => {
    //res.sendFile('./views/index.html', {root: __dirname});
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
})
//OR
//using regex in routes

/*app.get('^/$|/index(.html)?', (req, res) => {
    //res.sendFile('./views/index.html', {root: __dirname});
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
})*/
app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
})

app.get('/old-page.html', (req, res) => {
    res.redirect(301, '/new-page.html'); //302 by default
})

app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})

//Route Handlers

app.get('/hello(.html)?', (req, res, next) => {
    console.log('Attempeted to load hello.html');
    next()
}, (req, res) => {
    res.send('Hello World');
})

//Chaining route handlers
const one = (req, res, next) => {
    console.log('One');
    next();
}
const two = (req, res, next) => {
    console.log('two');
    next();
}
const three = (req, res) => {
    console.log('Three');
    res.send('Finished');
}
app.get('/chain.html', [one, two, three]);

app.use(errorHandler);

//server listening for request
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});