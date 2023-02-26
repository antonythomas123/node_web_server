const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;  //port for our web server

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

//server listening for request
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});