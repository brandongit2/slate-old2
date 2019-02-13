const {pool} = require('./sqlConnect.js');
const crypto = require('crypto');

function randomBytes(bytes) {
    return new Promise(function randomBytesPromise(resolve, reject) {
        crypto.randomBytes(bytes, function (err, buffer) {
            if (err) return reject(err);
            resolve(buffer);
        });
    });
}

async function genToken(len) {
    return (await randomBytes(len)).toString('base64').substring(0, len);
}

exports.auth = async (req, res, next) => {
	if (req.headers.authorization) {
		const user = await pool.query("SELECT users.id,users.first_name,users.last_name,users.valid_email FROM users JOIN logintokens ON users.id=logintokens.userid WHERE logintokens.token=? AND logintokens.valid AND CURRENT_TIMESTAMP < logintokens.expiry", [req.headers.authorization]);

		if (user.length === 1) {
			req.user = {
				id: user[0].id,
				first_name: user[0].first_name,
				last_name: user[0].last_name,
				valid_email: user[0].valid_email
			};

			pool.query("UPDATE logintokens SET expiry=TIMESTAMPADD(HOUR, extend, CURRENT_TIMESTAMP) WHERE token=?", [req.headers.authorization]);
		}
	}

	next();
};

exports.createToken = async function(user, extended) {
	const token = await genToken(16);
	const extend = extended ? 336 : 2;
	await pool.query("INSERT INTO logintokens (token, userid, creation, extend, expiry, valid) VALUES (?, ?, CURRENT_TIMESTAMP, ?, TIMESTAMPADD(HOUR, ?, CURRENT_TIMESTAMP), 1)", [token, user, extend, extend]);
	return token;
}
