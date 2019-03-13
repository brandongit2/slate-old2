const katex = require('katex');
const sql = require('promise-mysql');
const sanitizeHtml = require('sanitize-html');
const showdown = require('showdown');

const {mysql: mysqlCreds} = require('./config.json');

const converter = new showdown.Converter();

exports.auth = async (req, res, next) => {
    if (req.cookies.authToken) {
        try {
            const user = await exports.mysql.query('SELECT users.id, users.first_name, users.last_name, users.email, users.valid_email, users.permissions, users.password_reset, users.theme FROM users JOIN login_tokens ON users.id=login_tokens.user_id WHERE login_tokens.token=? AND login_tokens.valid AND CURRENT_TIMESTAMP < login_tokens.expiry', [req.cookies.authToken]);
            
            if (user.length === 1) {
                req.user = user[0];
                await exports.mysql.query('UPDATE login_tokens SET expiry=TIMESTAMPADD(HOUR, extend, CURRENT_TIMESTAMP) WHERE token=?', [req.cookies.authToken]);
            }
        } catch (err) {
            console.error(err);
            res.end();
        }
    }
    
    next();
};

exports.createToken = async (user, extended) => {
    const token = await exports.genToken(16);
    const extend = extended ? 720 : 1;
    try {
        exports.mysql.query('INSERT INTO login_tokens (token, user_id, creation, extend, expiry, valid) VALUES (?, ?, CURRENT_TIMESTAMP, ?, TIMESTAMPADD(HOUR, ?, CURRENT_TIMESTAMP), 1)', [token, user, extend, extend]);
    } catch (err) {
        console.error(err);
    }
    
    return token;
};

exports.genToken = async len => {
    return (await exports.randomBytes(len)).toString('base64').substring(0, len);
};

exports.mysql = sql.createPool({
    user:     mysqlCreds.user,
    password: mysqlCreds.pass,
    host:     mysqlCreds.host,
    database: mysqlCreds.database
});

exports.parseContent = content => {
    content = content.replace(/\$\$([\w\W]+?)\$\$/gm, (match, tex) => katex.renderToString(tex, {
        throwOnError: false,
        displayMode:  true
    }));
    
    content = content.replace(/\$([\w\W]+?)\$/gm, (match, tex) => katex.renderToString(tex, {
        throwOnError: false,
        displayMode:  false
    }));
    
    content = converter.makeHtml(content);
    
    content = sanitizeHtml(content, {
        allowedTags: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
            'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
            'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe',
            'svg', 'path', 'span'
        ], allowedAttributes: {
            a:    ['href', 'name', 'target'],
            img:  ['src'],
            svg:  ['width', 'height', 'viewbox', 'preserveaspectratio'],
            path: ['d'],
            span: ['style', 'class']
        }
    });
    
    return content;
};

exports.randomBytes = bytes => {
    return new Promise(((resolve, reject) => {
        crypto.randomBytes(bytes, (err, buffer) => {
            if (err) return reject(err);
            resolve(buffer);
        });
    }));
};
