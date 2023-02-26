const { format } = require('date-fns')
const { v4: uuid } = require('uuid');

const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

const logEvents = async (message, logName) => {
    const logTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${logTime}\t${uuid()}\t${message}`;

    try {
        if (!fs.existsSync(path.join(__dirname, 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, 'logs', logName), logItem, (err) => {
            if (err) {
                console.error(err);
            }
        })

    } catch (err) {
        console.error(err)
    }
}

module.exports = logEvents;