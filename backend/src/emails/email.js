/*
 * This file is currently unused.
 */

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport();
exports.send = email => {
    email.from = 'Slate <no-reply@slate.cx>';
    transporter.sendMail(email);
};
