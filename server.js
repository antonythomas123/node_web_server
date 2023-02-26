const logEvents = require('./log');
const EventEmitter = require('events');

const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

const http = require('http');

class Emitter extends EventEmitter { };
const myEmitter = new Emitter();        //initialize Object

const PORT = process.env.PORT || 3500;  //port for our web server

//minimal server
const server = http.createServer((req,res) => {
    console.log(req.url, req.method);

    //extension of req url
    const extension = path.extname(req.url);

    //setting up the contentType
    let contentType;

    switch(extension){
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType='text/javascript';
            break;
        case '.json': 
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default: 
            contentType = 'text/html';
            break;
    }
})





// myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));

//server listening for request
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});