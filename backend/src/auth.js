const {promisify} = require('util');
const bcryptCompare = promisify(require('bcrypt').compare);
const crypto = require('crypto');

const auth = require('./auth');
const {pool, mysqlErrorHandler} = require('./sqlConnect');

function randomBytes(bytes) {
    return new Promise(((resolve, reject) => {
        crypto.randomBytes(bytes, (err, buffer) => {
            if (err) return reject(err);
            resolve(buffer);
        });
    }));
}

async function genToken(len) {
    return (await randomBytes(len)).toString('base64').substring(0, len);
}

exports.auth = async (req, res, next) => {
    if (req.cookies.authToken) {
        req.token = true;
        try {
            const user = await pool.query('SELECT users.id, users.first_name, users.last_name, users.email, users.valid_email, users.permissions, users.password_reset, users.theme FROM users JOIN login_tokens ON users.id=login_tokens.user_id WHERE login_tokens.token=? AND login_tokens.valid AND CURRENT_TIMESTAMP < login_tokens.expiry', [req.cookies.authToken]);
            if (user.length === 1) {
                req.user = user[0];
                pool.query('UPDATE login_tokens SET expiry=TIMESTAMPADD(HOUR, extend, CURRENT_TIMESTAMP) WHERE token=?', [req.cookies.authToken]);
            }
        } catch (err) {
            mysqlErrorHandler(err);
            res.end();
        }
    } else {
        req.token = false;
    }
    next();
};

exports.createToken = async (user, extended) => {
    const token = await genToken(16);
    const extend = extended ? 720 : 1;
    try {
        pool.query('INSERT INTO login_tokens (token, user_id, creation, extend, expiry, valid) VALUES (?, ?, CURRENT_TIMESTAMP, ?, TIMESTAMPADD(HOUR, ?, CURRENT_TIMESTAMP), 1)', [token, user, extend, extend]);
    } catch (err) {
        mysqlErrorHandler(err);
    }
    
    return token;
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

exports.logIn = async (req, res) => {
    try {
        if (req.body.email && req.body.password && req.body.stayLoggedIn != null) {
            const user = await pool.query('SELECT id,password FROM users WHERE email=?', [req.body.email]);
            if (user.length < 1) {
                res.send({success: false});
                return;
            }
            const hash = user[0].password.toString();
            const userId = user[0].id;
        
            const success = await bcryptCompare(req.body.password, hash);
            if (success) { res.cookie('authToken', await auth.createToken(userId, req.body.stayLoggedIn)); }
        
            res.send({
                success
            });
        } else {
            res.send({
                success: false
            });
        }
    } catch (err) {
        mysqlErrorHandler(err);
        res.end(500);
    }
};

exports.logOut = (req, res) => {
    if (req.user) {
        pool.query('UPDATE login_tokens SET valid=0 WHERE user_id=?', [req.user.id]);
        res.clearCookie('authToken');
        res.end();
    } else {
        res.send('You are not logged in.');
    }
};

exports.resetPassword = (req, res) => {
    if (req.token) {
        console.log('USER ' + req.user);
        try {
            if (req.user) {
                pool.query('UPDATE login_tokens JOIN users ON login_tokens.user_id=users.id SET login_tokens.valid=0 WHERE users.email=?', [req.body.email]);
                pool.query('UPDATE users SET password_reset=1 WHERE email=?', [req.body.email]);
                res.send({success: true});
            } else {
                res.send('Invalid token.').end(401);
            }
        } catch (err) {
            mysqlErrorHandler(err);
            res.end(500);
        }
    } else {
        res.send('No token.').end(401);
    }
};
