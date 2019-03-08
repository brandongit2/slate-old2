const fs = require('fs');
const path = require('path');

exports.emails = {
    passwordReset: fs.readFileSync(path.join(__dirname, 'passwordResetEmail.html'), 'utf8').split('##'),
    verification:  fs.readFileSync(path.join(__dirname, 'verificationEmail.html'), 'utf8').split('##')
};

exports.getEmail = (email, args) => {
    let str = '';
    for (let i = 0; i < email.length; i++) {
        str += i % 2 === 0 ? email[i] : args[email[i]];
    }
    return str;
};
