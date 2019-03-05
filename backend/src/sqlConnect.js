const mysql = require('promise-mysql');

const {mysql: mysqlCreds, verboseErrors} = require('./config.json');

exports.pool = mysql.createPool({
    user:     mysqlCreds.user,
    password: mysqlCreds.pass,
    host:     mysqlCreds.host,
    database: mysqlCreds.database
});

exports.mysqlErrorHandler = err => {
    switch (err.code) {
        case 'ECONNREFUSED':
            console.error('Could not connect to MySQL. Make sure you have started the server.');
            break;
        default:
            if (verboseErrors) console.error(err);
            console.trace();
    }
};
