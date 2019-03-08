const {pool} = require('./sqlConnect');

exports.toggleTheme = async (req, res) => {
    if (req.user) {
        const newTheme = req.user.theme === 'light' ? 'dark' : 'light';
        pool.query('UPDATE users SET theme=? WHERE id=?', [newTheme, req.user.id]);
        res.end();
    } else {
        res.status(401).send('Unauthorized');
    }
};
