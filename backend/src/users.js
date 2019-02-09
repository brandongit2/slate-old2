const bcrypt = require('bcrypt');

const {pool} = require('./sqlConnect.js');

exports.addUser = async (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        pool.query(`
            INSERT INTO
                users(
                    first_name,
                    last_name,
                    email,
                    password
                )
            VALUES (
                '${req.body.firstName}',
                '${req.body.lastName}',
                '${req.body.email}',
                '${hash}'
            )
        `).then(() => {
            res.json({
                success: true
            });
        }).catch(error => {
            res.json({
                success: false,
                error
            });
        });
    });
};
