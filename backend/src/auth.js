const bcrypt = require('bcrypt');
const crypto = require('crypto');

const auth = require('./auth');
const {errors} = require('./constants');
const {pool} = require('./sqlConnect');

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
        const user = await pool.query('SELECT users.id, users.first_name, users.last_name, users.valid_email, users.permissions FROM users JOIN login_tokens ON users.id=login_tokens.user_id WHERE login_tokens.token=? AND login_tokens.valid AND CURRENT_TIMESTAMP < login_tokens.expiry', [req.cookies.authToken]);

        if (user.length === 1) {
            req.user = user[0];

            pool.query('UPDATE login_tokens SET expiry=TIMESTAMPADD(HOUR, extend, CURRENT_TIMESTAMP) WHERE token=?', [req.cookies.authToken]);
        }
    }

    next();
};

exports.createToken = async (user, extended) => {
    const token = await genToken(16);
    const extend = extended ? 720 : 1;
    await pool.query('INSERT INTO login_tokens (token, user_id, creation, extend, expiry, valid) VALUES (?, ?, CURRENT_TIMESTAMP, ?, TIMESTAMPADD(HOUR, ?, CURRENT_TIMESTAMP), 1)', [token, user, extend, extend]);
    return token;
};

exports.authenticate = async (req, srvRes) => {
    try {
        const hash = (await pool.query('SELECT password FROM users WHERE email=?', [req.body.email]))[0].password.toString();
        const userId = (await pool.query('SELECT id FROM users WHERE email=?', [req.body.email]))[0].id;
        
        bcrypt.compare(req.body.password, hash, async (err, cryptRes) => {
            srvRes.cookie('authToken', await auth.createToken(userId, req.body.stayLoggedIn));
            
            srvRes.send({
                success: cryptRes
            });
        });
    } catch {
        srvRes.send({
            success: false,
            error:   errors.INVALID_LOGIN
        });
    }
};

exports.logIn = (req, res) => {
    if (req.user) {
        res.send({
            success: true,
            user:    req.user
        });
    } else {
        res.send({success: false});
    }
};

exports.logOut = async (req, res) => {
    if (req.user) {
        await pool.query('UPDATE login_tokens SET valid=0 WHERE user_id=?', [req.user.id]);
        res.clearCookie('authToken');
    }
    
    res.end();
};

exports.resetPassword = async (req, res) => {
    if (req.body.email) {
        pool.query('UPDATE login_tokens JOIN users ON login_tokens.user_id=users.id SET login_tokens.valid=0 WHERE users.email=?', [req.body.email]);
    }
};
