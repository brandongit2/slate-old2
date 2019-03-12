const {promisify} = require('util');
const bcryptHash = promisify(require('bcrypt').hash);
const sgMail = require('@sendgrid/mail');
const {generate} = require('shortid');
const zxcvbn = require('zxcvbn');

const auth = require('./auth');
const {errors} = require('./constants');
const {emails, getEmail} = require('./emails');
const {pool, mysqlErrorHandler} = require('./sqlConnect');

const {email: {apiKey}, rootUrl, verboseErrors} = require('./config.json');

sgMail.setApiKey(apiKey);

const sendEmail = async (fName, email, validationQuery) => {
    sgMail.send({
        to:      email,
        from:    'Slate <no-reply@brandontsang.net>',
        subject: 'Slate: Validate your e-mail',
        ...getEmail(emails.verification, {name: fName, query: validationQuery, rootUrl})
    });
    
    try {
        await pool.query('DELETE FROM email_verification WHERE email=?', [email]);
        await pool.query('INSERT INTO email_verification(email, query, expiry) VALUES (?, ?, TIMESTAMPADD(HOUR, 24, CURRENT_TIMESTAMP))', [email, validationQuery]);
        return {
            success: true
        };
    } catch (err) {
        mysqlErrorHandler(err);
        
        return {
            success: false
        };
    }
};

exports.addUser = async (req, res) => {
    let valid = true;
    const email = req.body.email;
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const password = req.body.password;

    if (email != null && fName != null && lName != null && password != null) {
        // Validate e-mail
        if (email.length > 254 || !require('email-validator').validate(email)) valid = false;
        if (fName.length === 0 || fName.length > 50) valid = false;
        if (lName.length > 50) valid = false;
        if (password.length > 72 || zxcvbn(password).score < 2) valid = false;

        if (valid) {
            const validationQuery = generate(); // Will be used as a query string when validating e-mails.

            let hash;
            try {
                hash = await bcryptHash(password, 10);
            } catch (err) {
                if (verboseErrors) console.error(err);
                console.trace();
            }

            try {
                await pool.query('INSERT INTO users(first_name, last_name, email, password, valid_email, permissions) VALUES (?, ?, ?, ?, 0, 5)', [fName, lName, email, hash]);
            
                res.send(await sendEmail(fName, email, validationQuery));
            } catch (err) {
                switch (err.errno) {
                    case 1062:
                        res.json({
                            success: false,
                            error:   errors.ACCOUNT_EXISTS
                        });
                        break;
                    default:
                        mysqlErrorHandler(err);
                        res.end();
                }
            }
        } else {
            res.json({
                success: false,
                error:   errors.INVALID_FORM
            });
        }
    } else {
        res.json({
            success: false,
            error:   errors.INVALID_FORM
        });
    }
};

exports.resendEmail = async (req, res) => {
    try {
        const validEmail = (await pool.query('SELECT email FROM email_verification WHERE email=?', [req.body.email])).length === 1;

        if (validEmail) {
            res.send(await sendEmail(req.body.firstName, req.body.email, generate()));
        } else {
            res.json({
                success: false,
                error:   errors.RESEND_EMAIL_NOT_FOUND
            });
        }
    } catch (err) {
        mysqlErrorHandler(err);
        res.end();
    }
};

exports.deactivate = async (req, res) => {
    try {
        pool.query('DELETE users FROM users LEFT JOIN email_verification ON users.email=email_verification.email WHERE email_verification.query=? AND CURRENT_TIMESTAMP < expiry', [req.body.query]);
    } catch (err) {
        mysqlErrorHandler(err);
    }
    
    res.end();
};

exports.verifyEmail = async (req, res) => {
    if (req.body.query) {
        try {
            const emails = await pool.query('SELECT email FROM email_verification WHERE query=? AND CURRENT_TIMESTAMP < expiry', [req.body.query]);
            
            if (emails.length === 1) {
                pool.query('UPDATE users SET valid_email=1 WHERE email=?', [emails[0].email]);
                pool.query('DELETE FROM email_verification WHERE query=?', [req.body.query]);
                    
                res.cookie('authToken', auth.createToken(), {secure: true});
                res.send({
                    success: true
                });
            } else {
                res.send({
                    success: false,
                    error:   errors.QUERY_NOT_IN_DATABASE
                });
            }
        } catch (err) {
            mysqlErrorHandler(err);
            res.end();
        }
    } else {
        res.json({
            success: false,
            error:   errors.QUERY_EXPECTED
        });
    }
};
