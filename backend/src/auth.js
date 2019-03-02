const bcrypt = require('bcrypt');
const crypto = require('crypto');

const auth = require('./auth.js');
const {pool} = require('./sqlConnect.js');

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
        const user = await pool.query('SELECT users.id, users.first_name, users.last_name, users.valid_email FROM users JOIN logintokens ON users.id=logintokens.userid WHERE logintokens.token=? AND logintokens.valid AND CURRENT_TIMESTAMP < logintokens.expiry', [req.cookies.authToken]);

        if (user.length === 1) {
            req.user = user[0];

            pool.query('UPDATE logintokens SET expiry=TIMESTAMPADD(HOUR, extend, CURRENT_TIMESTAMP) WHERE token=?', [req.cookies.authToken]);
        }
    }

    next();
};

exports.createToken = async (user, extended) => {
    const token = await genToken(16);
    const extend = extended ? 720 : 2;
    await pool.query('INSERT INTO logintokens (token, userid, creation, extend, expiry, valid) VALUES (?, ?, CURRENT_TIMESTAMP, ?, TIMESTAMPADD(HOUR, ?, CURRENT_TIMESTAMP), 1)', [token, user, extend, extend]);
    return token;
};

exports.authenticate = async (req, srvRes) => {
    const hash = (await pool.query('SELECT password FROM users WHERE email=?', [req.body.email]))[0].password.toString();
    const userId = (await pool.query('SELECT id FROM users WHERE email=?', [req.body.email]))[0].id;

    bcrypt.compare(req.body.password, hash, async (err, cryptRes) => {
        srvRes.cookie('authToken', await auth.createToken(userId, false));
        
        srvRes.json({
            success: cryptRes
        });
    });
};

exports.logIn = (req, res) => {
    if (req.cookies.authToken && req.user) {
        res.json({
            success: true,
            user:    req.user
        });
    } else {
        res.json({success: false});
    }
};
