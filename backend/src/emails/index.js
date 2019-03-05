const fs = require('fs');
const path = require('path');

exports.emails = {
    passwordReset: fs.readFileSync(path.join(__dirname, 'passwordResetEmail.html'), 'utf8').split('##'),
    verification:  fs.readFileSync(path.join(__dirname, 'verificationEmail.html'), 'utf8').split('##')
};

exports.getEmail = async (emailName, args) => {
    let str = '';
    for (let i = 0; i < exports.emails[emailName].length; i++) {
        str += i % 2 === 0 ? exports.emails[emailName][i] : args[exports.emails[emailName][i]];
    }
    return str;
};
