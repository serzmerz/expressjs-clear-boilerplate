const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const config = require('./config');

const port = process.env.port;
const server = express();

server.disable('x-powered-by');

server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());

server.use('/', require('./controllers'));

server.use((error, req, res, next) => {
    const env = config.get('env');

    if (error) {
        if (env === 'local' || env === 'development') {
            res
                .status(503)
                .header('Content-Type', 'text/html; charset=utf-8')
                .send(`<pre>${error}</pre>`);
        } else {
            res.status(520).end();
        }
    }
    next();
});

server.listen(port, () => {
    console.log('The server is running at port ' + port); // eslint-disable-line no-console
});
