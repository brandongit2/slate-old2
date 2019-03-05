// For retrieving data such as subjects, courses, units, and articles.

const {pool, mysqlErrorHandler} = require('./sqlConnect');

exports.getAllSubjects = async (req, res) => {
    try {
        const list = await pool.query('SELECT id, name, display_name, description, color FROM subjects ORDER BY `order`');
        res.send(list);
    } catch (err) {
        mysqlErrorHandler(err);
    }
};

exports.getSubject = async (req, res) => {
    // Whether :id refers to a subject name or id
    const nameOrId = isNaN(req.params.id) ? 'name' : 'id';
    
    try {
        const data = await pool.query(`SELECT id, \`order\`, name, display_name, description, color FROM subjects WHERE ${nameOrId}=?`, [req.params.id]);
        
        if (data.length === 1) {
            res.send(data);
        } else {
            res.status(404).end();
        }
    } catch (err) {
        mysqlErrorHandler(err);
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const list = await pool.query('SELECT id, name, display_name, description FROM courses ORDER BY `order`');
        res.send(list);
    } catch (err) {
        mysqlErrorHandler(err);
    }
};

exports.getCourse = async (req, res) => {
    // Whether :id refers to a subject name or id
    const nameOrId = isNaN(req.params.id) ? 'name' : 'id';
    
    try {
        const data = await pool.query(`SELECT id, \`order\`, name, display_name, description, subject_id FROM courses WHERE ${nameOrId}=?`, [req.params.id]);
        
        if (data.length === 1) {
            res.send(data);
        } else {
            res.status(404).end();
        }
    } catch (err) {
        mysqlErrorHandler(err);
    }
};

exports.getAllUnits = async (req, res) => {
    try {
        const list = await pool.query('SELECT id, name, display_name, description FROM units ORDER BY `order`');
        res.send(list);
    } catch (err) {
        mysqlErrorHandler(err);
    }
};

exports.getUnit = async (req, res) => {
    // Whether :id refers to a subject name or id
    const nameOrId = isNaN(req.params.id) ? 'name' : 'id';
    
    try {
        const data = await pool.query(`SELECT id, \`order\`, name, display_name, description, course_id FROM units WHERE ${nameOrId}=?`, [req.params.id]);
        
        if (data.length === 1) {
            res.send(data);
        } else {
            res.status(404).end();
        }
    } catch (err) {
        mysqlErrorHandler(err);
    }
};

exports.getAllArticles = async (req, res) => {
    try {
        const list = await pool.query('SELECT id, title, display_title, publish_date, update_date, content FROM articles ORDER BY `order`');
        res.send(list);
    } catch (err) {
        mysqlErrorHandler(err);
    }
};

exports.getArticle = async (req, res) => {
    // Whether :id refers to a subject name or id
    const nameOrId = isNaN(req.params.id) ? 'title' : 'id';
    
    try {
        const data = await pool.query(`SELECT id, \`order\`, title, display_title, publish_date, update_date, content, unit_id FROM articles WHERE ${nameOrId}=?`, [req.params.id]);
        
        if (data.length === 1) {
            res.send(data);
        } else {
            res.status(404).end();
        }
    } catch (err) {
        mysqlErrorHandler(err);
    }
};

exports.getParent = async (req, res) => {
    let parent;
    let nameOrId;
    
    // Whether query refers to a name or id
    if (req.query.course) {
        nameOrId = isNaN(req.query.course) ? 'name' : 'id';
    } else if (req.query.unit) {
        nameOrId = isNaN(req.query.unit) ? 'name' : 'id';
    } else if (req.query.article) {
        nameOrId = isNaN(req.query.article) ? 'name' : 'id';
    } else {
        res.status(404).end();
    }
    
    try {
        if (req.query.want) {
            if (req.query.want === 'subject') {
                if (req.query.course) {
                    parent = await pool.query(`SELECT DISTINCT subjects.id, subjects.name, subjects.display_name, subjects.description, subjects.color FROM subjects JOIN courses ON subjects.id=courses.subject_id WHERE courses.${nameOrId}=?`, [req.query.course]);
                } else if (req.query.unit) {
                    parent = await pool.query(`SELECT DISTINCT subjects.id, subjects.name, subjects.display_name, subjects.description, subjects.color FROM subjects JOIN courses ON subjects.id=courses.subject_id JOIN units ON courses.id=units.course_id WHERE units.${nameOrId}=?`, [req.query.unit]);
                } else if (req.query.article) {
                    parent = await pool.query(`SELECT DISTINCT subjects.id, subjects.name, subjects.display_name, subjects.description, subjects.color FROM subjects JOIN courses ON subjects.id=courses.subject_id JOIN units ON courses.id=units.course_id JOIN articles ON units.id=articles.unit_id WHERE articles.${nameOrId}=?`, [req.query.article]);
                }
            } else if (req.query.want === 'course') {
                if (req.query.unit) {
                    parent = await pool.query(`SELECT DISTINCT courses.id, courses.name, courses.display_name, courses.description, courses.subject_id FROM courses JOIN units ON courses.id=units.course_id WHERE units.${nameOrId}=?`, [req.query.unit]);
                } else if (req.query.article) {
                    parent = await pool.query(`SELECT DISTINCT courses.id, courses.name, courses.display_name, courses.description, courses.subject_id FROM courses JOIN units ON courses.id=units.course_id JOIN articles ON units.id=articles.unit_id WHERE articles.${nameOrId}=?`, [req.query.article]);
                }
            } else if (req.query.want === 'unit' && req.query.article) {
                parent = await pool.query(`SELECT DISTINCT units.id, units.name, units.display_name, units.description, units.course_id FROM units JOIN articles ON units.id=articles.unit_id WHERE articles.${nameOrId}=?`, [req.query.article]);
            } else {
                res.status(404).end();
            }
        } else if (req.query.course) {
            parent = await pool.query(`SELECT DISTINCT subjects.id, subjects.name, subjects.display_name, subjects.description, subjects.color FROM subjects JOIN courses ON subjects.id=courses.subject_id WHERE courses.${nameOrId}=?`, [req.query.course]);
        } else if (req.query.unit) {
            parent = await pool.query(`SELECT DISTINCT courses.id, courses.name, courses.display_name, courses.description, courses.subject_id FROM courses JOIN units ON courses.id=units.course_id WHERE units.${nameOrId}=?`, [req.query.unit]);
        } else if (req.query.article) {
            if (nameOrId === 'name') nameOrId = 'title';
            parent = await pool.query(`SELECT DISTINCT units.id, units.name, units.display_name, units.description, units.course_id FROM units JOIN articles ON units.id=articles.unit_id WHERE articles.${nameOrId}=?`, [req.query.article]);
        } else {
            res.status(404).end();
        }
    } catch (err) {
        mysqlErrorHandler(err);
    }
    
    res.send(parent);
};

exports.getChildren = async (req, res) => {
    let children;
    
    try {
        if (req.query.subject) {
            // Whether query refers to a name or id
            const nameOrId = isNaN(req.query.subject) ? 'name' : 'id';
            
            children = await pool.query(`SELECT courses.id, courses.order, courses.name, courses.display_name, courses.description FROM courses JOIN subjects ON subjects.id=courses.subject_id where subjects.${nameOrId}=?`, [req.query.subject]);
        } else if (req.query.course) {
            // Whether query refers to a name or id
            const nameOrId = isNaN(req.query.course) ? 'name' : 'id';
            
            children = await pool.query(`SELECT units.id, units.order, units.name, units.display_name, units.description FROM units JOIN courses ON courses.id=units.course_id where courses.${nameOrId}=?`, [req.query.course]);
        } else if (req.query.unit) {
            // Whether query refers to a name or id
            const nameOrId = isNaN(req.query.unit) ? 'name' : 'id';
            
            children = await pool.query(`SELECT articles.id, articles.order, articles.title, articles.display_title, articles.publish_date, articles.update_date, articles.content FROM articles JOIN units ON units.id=articles.unit_id where units.${nameOrId}=?`, [req.query.unit]);
        } else {
            res.status(404).end();
        }
    } catch (err) {
        mysqlErrorHandler(err);
    }
    
    res.send(children);
};
