const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
const {generate} = require('shortid');
const zxcvbn = require('zxcvbn');

const {apiKey} = require('../sendgrid.json');
const {pool} = require('./sqlConnect.js');
const {verificationEmail} = require('./verificationEmail.js');

sgMail.setApiKey(apiKey);

exports.addUser = async (req, res) => {
    let valid = true;
    const email = req.body.email;
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const password = req.body.password;

    if (email.length > 254 || !require('email-validator').validate(email)) valid = false;
    if (fName.length === 0 || fName.length > 50) valid = false;
    if (lName.length > 50) valid = false;
    if (password.length > 72 || zxcvbn(password).score < 2) valid = false;

    if (valid) {
        const validationQuery = generate(); // Will be used as a query string when validating e-mails.

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error(err);
                res.json({
                    success: false,
                    error:   err
                });
            }

            pool.query(`
                INSERT INTO
                    users(
                        first_name,
                        last_name,
                        email,
                        password,
                        valid_email
                    )
                VALUES (?, ?, ?, ?, 0)
            `, [fName, lName, email, hash]).then(() => {
                pool.query('INSERT INTO email_validation_links(email, query) VALUES (?, ?)', [email, validationQuery])
                    .then(() => {
                        res.json({
                            success: true
                        });
                    })
                    .catch(err => { console.log(err); });
            }).catch(error => {
                res.json({
                    success: false,
                    error
                });
            });
        });

        // Validate e-mail
        const textEmail = `Hi ${fName},
        Welcome to Slate! To log in, you must first verify your email. Do this by following this link: ${validationQuery}`;

        sgMail.send({
            to:      email,
            from:    'Slate <no-reply@brandontsang.net>',
            subject: 'Slate: Validate your e-mail',
            text:    textEmail,
            html:    verificationEmail(fName, validationQuery)
        });
    } else {
        res.end('Invalid form.');
    }
};

exports.authenticate = async (req, srvRes) => {
    const hash = (await pool.query(`SELECT password FROM users WHERE email='${req.body.email}'`))[0].password.toString();

    bcrypt.compare(req.body.password, hash, (err, cryptRes) => {
        srvRes.json({authenticate: cryptRes});
    });
};

exports.verifyEmail = async (req, res) => {
    pool.query('SELECT email FROM email_validation_links WHERE query=?', [req.query.e])
        .then(emails => {
            if (emails.length === 1) {
                pool.query('DELETE FROM email_validation_links WHERE query=?', [req.query.e]);
                res.json({success: true});
            } else {
                res.json({success: false});
            }
        });
};
