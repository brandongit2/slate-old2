const {promisify} = require('util');

const bcryptCompare = promisify(require('bcrypt').compare);
const bcryptHash = promisify(require('bcrypt').hash);
const {generate} = require('shortid');
const zxcvbn = require('zxcvbn');

const {errors} = require('./constants');
const {createToken, mysql, sendVerificationEmail} = require('./util');

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
                console.error(err);
            }

            try {
                await mysql.query('INSERT INTO users(first_name, last_name, email, password, valid_email, permissions) VALUES (?, ?, ?, ?, 0, 1)', [fName, lName, email, hash]);
            
                res.send(await sendVerificationEmail(fName, email, validationQuery));
            } catch (err) {
                switch (err.errno) {
                    case 1062:
                        res.json({
                            success: false,
                            error:   errors.ACCOUNT_EXISTS
                        });
                        break;
                    default:
                        console.error(err);
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

exports.authenticate = (req, res) => {
    if (req.user) {
        res.send({
            success: true,
            user:    req.user
        });
    } else {
        res.send({
            success: false
        });
    }
};

exports.deactivate = async (req, res) => {
    let queryRes;
    try {
        queryRes = await mysql.query('DELETE users FROM users LEFT JOIN email_codes ON users.email=email_codes.email WHERE email_codes.query=? AND type="new-account" AND CURRENT_TIMESTAMP < expiry', [req.body.query]);
        res.json({success: !!queryRes.affectedRows});
    } catch (err) {
        console.error(err);
        res.end(500);
    }
};

exports.logIn = async (req, res) => {
    try {
        if (req.body.email && req.body.password && req.body.stayLoggedIn != null) {
            const user = await mysql.query('SELECT id,password FROM users WHERE email=?', [req.body.email]);
            if (user.length < 1) {
                res.send({success: false});
                return;
            }
            const hash = user[0].password.toString();
            const userId = user[0].id;
            
            const success = await bcryptCompare(req.body.password, hash);
            if (success) {
                res.cookie('authToken', await createToken(userId, req.body.stayLoggedIn), {maxAge: 1000000000000});
            }
            
            res.send({
                success
            });
        } else {
            res.send({
                success: false
            });
        }
    } catch (err) {
        console.error(err);
        res.end(500);
    }
};

exports.logOut = async (req, res) => {
    if (req.user) {
        await mysql.query('UPDATE login_tokens SET valid=0 WHERE token=?', [req.cookies.authToken]);
        res.clearCookie('authToken');
        res.send('Logged out.');
    } else {
        res.send('You are not logged in.');
    }
};

exports.resetPassword = async (req, res) => {
    if (req.cookies.authToken) {
        try {
            if (req.user) {
                await mysql.query('UPDATE login_tokens JOIN users ON login_tokens.user_id=users.id SET login_tokens.valid=0 WHERE users.email=?', [req.body.email]);
                await mysql.query('UPDATE users SET password_reset=1 WHERE email=?', [req.body.email]);
                res.send({success: true});
            } else {
                res.status(401).send('Invalid token.');
            }
        } catch (err) {
            console.error(err);
            res.end(500);
        }
    } else {
        res.status(401).send('No token.');
    }
};

exports.resendEmail = async (req, res) => {
    try {
        const validEmail = (await mysql.query('SELECT email FROM email_codes WHERE email=? AND type="new-account"', [req.body.email])).length === 1;

        if (validEmail) {
            res.send(await sendVerificationEmail(req.body.firstName, req.body.email, generate()));
        } else {
            res.json({
                success: false,
                error:   errors.RESEND_EMAIL_NOT_FOUND
            });
        }
    } catch (err) {
        console.error(err);
        res.end();
    }
};

exports.verifyEmail = async (req, res) => {
    if (req.body.query) {
        try {
            const emails = await mysql.query('SELECT email FROM email_codes WHERE query=? AND type="new-account" AND CURRENT_TIMESTAMP < expiry', [req.body.query]);
            
            if (emails.length === 1) {
                mysql.query('UPDATE users SET valid_email=1 WHERE email=?', [emails[0].email]);
                mysql.query('DELETE FROM email_codes WHERE query=?', [req.body.query]);
                    
                res.cookie('authToken', createToken(), {secure: true});
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
            console.error(err);
            res.end();
        }
    } else {
        res.json({
            success: false,
            error:   errors.QUERY_EXPECTED
        });
    }
};
