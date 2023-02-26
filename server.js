const logEvents = require('./log');
const EventEmitter = require('events');

const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

const http = require('http');

class Emitter extends EventEmitter { };
const myEmitter = new Emitter();        //initialize Object
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));

const PORT = process.env.PORT || 3500;  //port for our web server

//basic serveFile FUnction : function that can be called for a 404 or fileExist
const serveFile = async (filePath,contentType,response) => {
    try{
        //getting data from the file
        const rawData =  await fsPromises.readFile(
            filePath, 
            !contentType.includes('image') ? 'utf8' : ''
        );
        //to deal with json files
        const data = contentType === 'application/json'
            ? JSON.parse(rawData) : rawData;
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200, 
            {'Content-Type': contentType}
        );
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    }catch(err){
        console.log(err);
        myEmitter.emit('log', `${err.name}: ${err.message}`, 'errLog.txt');
        response.statusCode = 500;  //server error
        response.end();
    }
}

//minimal server
const server = http.createServer((req,res) => {
    console.log(req.url, req.method);

    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt');

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

    //Setting the filePath
    let filePath = 
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'views', req.url /* url of the subdirectory*/, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, req.url);

    //makes the .html extension not required in the browser
    if(!extension && req.url.slice(-1) !== '/') filePath += '.html';

    //To check whether the requested file path exists
    const fileExists = fs.existsSync(filePath);

    if(fileExists){
        //serve the file
        serveFile(filePath, contentType, res);
    }else{
        //404 || 301
        //console.log(path.parse(filePath));
        switch(path.parse(filePath).base){
            case 'old-page.html':
                res.writeHead(301, {'Location': '/new-page.html'});
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, {'Location': '/'});
                res.end();
                break;
            default:
                //serve a 404 response
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
        }
    }
})

//server listening for request
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});