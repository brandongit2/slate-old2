const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
const {generate} = require('shortid');
const zxcvbn = require('zxcvbn');

const {errors} = require('./constants.js');
const {pool} = require('./sqlConnect.js');
const {verificationEmail} = require('./verificationEmail.js');
const {apiKey} = require('../sendgrid.json');

sgMail.setApiKey(apiKey);

const sendEmail = async (fName, email, validationQuery) => {
    const textEmail = `Hi ${fName},
    Welcome to Slate! To log in, you must first verify your email. Do this by following this link: ${validationQuery}`;

    sgMail.send({
        to:      email,
        from:    'Slate <no-reply@brandontsang.net>',
        subject: 'Slate: Validate your e-mail',
        text:    textEmail,
        html:    verificationEmail(fName, validationQuery)
    });

    try {
        await pool.query('DELETE FROM email_verification WHERE email=?', [email]);
        await pool.query('INSERT INTO email_verification(email, query) VALUES (?, ?)', [email, validationQuery]);
        console.log('something');
        return {
            success: true
        };
    } catch (error) {
        console.log('something else');
        switch (error.errno) {
            default:
                console.log(error);
                return {
                    success: false,
                    error:   errors.MYSQL_ERROR
                };
        }
    }
};

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
                    error:   errors.BCRYPT_ERROR
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
            `, [fName, lName, email, hash])
                .then(async () => {
                    res.json(await sendEmail(fName, email, validationQuery));
                })
                .catch(err => {
                    switch (err.errno) {
                        case 1062:
                            res.json({
                                success: false,
                                error:   errors.ACCOUNT_EXISTS
                            });
                            break;
                        default:
                            console.error(err);
                            res.json({
                                success: false,
                                error:   errors.MYSQL_ERROR
                            });
                    }
                });
        });
    } else {
        res.json({
            success: false,
            error:   errors.INVALID_FORM
        });
    }
};

exports.resendEmail = async (req, res) => {
    const validEmail = (await pool.query('SELECT email FROM email_verification WHERE email=?', [req.body.email])).length === 1;

    if (validEmail) {
        res.json(await sendEmail(req.body.firstName, req.body.email, generate()));
    } else {
        return {
            success: false,
            error:   errors.RESEND_EMAIL_NOT_FOUND
        };
    }
};

exports.authenticate = async (req, srvRes) => {
    const hash = (await pool.query(`SELECT password FROM users WHERE email=?`, [req.body.email]))[0].password.toString();

    bcrypt.compare(req.body.password, hash, (err, cryptRes) => {
        srvRes.json({authenticate: cryptRes});
    });
};

exports.verifyEmail = async (req, res) => {
    if (req.query.e) {
        pool.query('SELECT email FROM email_verification WHERE query=?', [req.query.e])
            .then(emails => {
                if (emails.length === 1) {
                    try {
                        pool.query('UPDATE users SET valid_email=1 WHERE ev.email=?', [emails[0]]);
                        pool.query('DELETE FROM email_verification WHERE query=?', [req.query.e]);
                    } catch {
                        res.json({
                            success: false,
                            error:   errors.MYSQL_ERROR
                        });
                    }
                    res.json({success: true});
                } else {
                    res.json({
                        success: false,
                        error:   errors.QUERY_NOT_IN_DATABASE
                    });
                }
            })
            .catch(err => {
                console.log('nok');
                console.log(err);
                res.json({
                    success: false,
                    error:   errors.MYSQL_ERROR
                });
            });
    } else {
        console.log('haha yes');
        res.json({
            success: false,
            error:   errors.QUERY_EXPECTED
        });
    }
};
