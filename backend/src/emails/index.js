const fs = require('fs');
const path = require('path');

exports.emails = {
    passwordReset: {
        html: fs.readFileSync(path.join(__dirname, 'passwordResetEmail.html'), 'utf8').split('##'),
        text: fs.readFileSync(path.join(__dirname, 'passwordResetEmail.txt'), 'utf8').split('##')
    },
    verification: {
        html: fs.readFileSync(path.join(__dirname, 'verificationEmail.html'), 'utf8').split('##'),
        text: fs.readFileSync(path.join(__dirname, 'verificationEmail.txt'), 'utf8').split('##')
    }
};

exports.getEmail = (email, args) => {
    let html = '';
    for (let i = 0; i < email.html.length; i++) {
        html += i % 2 === 0 ? email.html[i] : args[email.html[i]];
    }
    
    let text = '';
    for (let i = 0; i < email.text.length; i++) {
        text += i % 2 === 0 ? email.text[i] : args[email.text[i]];
    }
    
    return {html, text};
};
