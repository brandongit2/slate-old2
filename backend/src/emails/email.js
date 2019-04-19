/*
 * This file is currently unused.
 */

const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

const {email: credentials} = require('../config.json');

if (credentials.provider === 'sendgrid') {
    sgMail.setApiKey(credentials.apiKey);
    exports.send = email => {
        email.from = credentials.from;
        sgMail.send(email);
    };
} else if (credentials.provider === 'smtp') {
    const transporter = nodemailer.createTransport(credentials.credentials);
    exports.send = email => {
        email.from = credentials.from;
        transporter.sendMail(email);
    };
} else if (credentials.provider === 'null') {
    exports.send = email => {};
} else {
    console.error('Invalid email provider: ' + credentials.provider);
}
