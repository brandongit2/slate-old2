const {mysql} = require('./util');

exports.changeEmail = async (req, res) => {
    if (req.user) {
        mysql.query('UPDATE users SET email=?', [req.body.email]);
    }
    
    res.end();
};

exports.changeName = async (req, res) => {};

exports.changePassword = async (req, res) => {
    
};

exports.toggleTheme = async (req, res) => {
    if (req.user) {
        const newTheme = req.user.theme === 'light' ? 'dark' : 'light';
        mysql.query('UPDATE users SET theme=? WHERE id=?', [newTheme, req.user.id]);
    }
    
    res.end();
};
