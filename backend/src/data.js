const {mysql, parseContent} = require('./util');

exports.getAllSubjects = async (req, res) => {
    try {
        const list = await mysql.query('SELECT id, name, display_name, description, color FROM subjects ORDER BY `order`');
        res.send(list);
    } catch (err) {
        console.error(err);
        res.end();
    }
};

exports.getSubject = async (req, res) => {
    // Whether :id refers to a subject name or id
    const nameOrId = isNaN(req.params.id) ? 'name' : 'id';

    try {
        const data = await mysql.query(`SELECT id, \`order\`, name, display_name, description, color FROM subjects WHERE ${nameOrId}=?`, [req.params.id]);
        if (data.length === 1) {
            res.send(data);
        } else {
            res.status(404).end();
        }
    } catch (err) {
        console.error(err);
        res.end();
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const list = await mysql.query('SELECT id, subject_id, name, display_name, description FROM courses ORDER BY `order`');
        res.send(list);
    } catch (err) {
        console.error(err);
        res.end();
    }
};

exports.getCourse = async (req, res) => {
    // Whether :id refers to a course name or id
    const nameOrId = isNaN(req.params.id) ? 'name' : 'id';

    try {
        const data = await mysql.query(`SELECT id, \`order\`, name, display_name, description, subject_id FROM courses WHERE ${nameOrId}=?`, [req.params.id]);

        if (data.length === 1) {
            res.send(data);
        } else {
            res.status(404).end();
        }
    } catch (err) {
        console.error(err);
        res.end();
    }
};

exports.getAllUnits = async (req, res) => {
    try {
        const list = await mysql.query('SELECT id, name, display_name, description FROM units ORDER BY `order`');
        res.send(list);
    } catch (err) {
        console.error(err);
        res.end();
    }
};

exports.getUnit = async (req, res) => {
    // Whether :id refers to a unit name or id
    const nameOrId = isNaN(req.params.id) ? 'name' : 'id';

    try {
        const data = await mysql.query(`SELECT id, \`order\`, name, display_name, description, course_id FROM units WHERE ${nameOrId}=?`, [req.params.id]);

        if (data.length === 1) {
            res.send(data);
        } else {
            res.status(404).end();
        }
    } catch (err) {
        console.error(err);
        res.end();
    }
};

exports.getAllArticles = async (req, res) => {
    try {
        let list = await mysql.query('SELECT id, title, display_title, publish_date, update_date FROM articles ORDER BY `order`');

        res.send(list);
    } catch (err) {
        console.error(err);
        res.end();
    }
};

exports.getArticle = async (req, res) => {
    // Whether :id refers to a article title or id
    const nameOrId = isNaN(req.params.id) ? 'title' : 'id';

    try {
        const data = await mysql.query(`SELECT id, \`order\`, title, display_title, publish_date, update_date, unit_id FROM articles WHERE ${nameOrId}=?`, [req.params.id]);

        if (data.length === 1) {
            res.send(data);
        } else {
            res.status(404).end();
        }
    } catch (err) {
        console.error(err);
        res.end();
    }
};

exports.getArticleContent = async (req, res) => {
    const nameOrId = isNaN(req.params.id) ? 'title' : 'id';

    try {
        const content = await mysql.query(`SELECT id, content FROM articles WHERE ${nameOrId}=?`, [req.params.id]);

        if (content.length === 1) {
            content[0].content = parseContent(content[0].content);
            res.send(content);
        } else {
            res.status(404).end();
        }
    } catch (err) {
        console.error(err);
        res.end();
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
        nameOrId = isNaN(req.query.article) ? 'title' : 'id';
    } else {
        res.status(404).end();
    }

    try {
        if (req.query.want) {
            if (req.query.want === 'subject') {
                if (req.query.course) {
                    parent = await mysql.query(`SELECT DISTINCT subjects.id, subjects.name, subjects.display_name, subjects.description, subjects.color FROM subjects JOIN courses ON subjects.id=courses.subject_id WHERE courses.${nameOrId}=?`, [req.query.course]);
                } else if (req.query.unit) {
                    parent = await mysql.query(`SELECT DISTINCT subjects.id, subjects.name, subjects.display_name, subjects.description, subjects.color FROM subjects JOIN courses ON subjects.id=courses.subject_id JOIN units ON courses.id=units.course_id WHERE units.${nameOrId}=?`, [req.query.unit]);
                } else if (req.query.article) {
                    parent = await mysql.query(`SELECT DISTINCT subjects.id, subjects.name, subjects.display_name, subjects.description, subjects.color FROM subjects JOIN courses ON subjects.id=courses.subject_id JOIN units ON courses.id=units.course_id JOIN articles ON units.id=articles.unit_id WHERE articles.${nameOrId}=?`, [req.query.article]);
                }
            } else if (req.query.want === 'course') {
                if (req.query.unit) {
                    parent = await mysql.query(`SELECT DISTINCT courses.id, courses.name, courses.display_name, courses.description, courses.subject_id FROM courses JOIN units ON courses.id=units.course_id WHERE units.${nameOrId}=?`, [req.query.unit]);
                } else if (req.query.article) {
                    parent = await mysql.query(`SELECT DISTINCT courses.id, courses.name, courses.display_name, courses.description, courses.subject_id FROM courses JOIN units ON courses.id=units.course_id JOIN articles ON units.id=articles.unit_id WHERE articles.${nameOrId}=?`, [req.query.article]);
                }
            } else if (req.query.want === 'unit' && req.query.article) {
                parent = await mysql.query(`SELECT DISTINCT units.id, units.name, units.display_name, units.description, units.course_id FROM units JOIN articles ON units.id=articles.unit_id WHERE articles.${nameOrId}=?`, [req.query.article]);
            } else {
                res.status(404).end();
            }
        } else if (req.query.course) {
            parent = await mysql.query(`SELECT DISTINCT subjects.id, subjects.name, subjects.display_name, subjects.description, subjects.color FROM subjects JOIN courses ON subjects.id=courses.subject_id WHERE courses.${nameOrId}=?`, [req.query.course]);
        } else if (req.query.unit) {
            parent = await mysql.query(`SELECT DISTINCT courses.id, courses.name, courses.display_name, courses.description, courses.subject_id FROM courses JOIN units ON courses.id=units.course_id WHERE units.${nameOrId}=?`, [req.query.unit]);
        } else if (req.query.article) {
            if (nameOrId === 'name') nameOrId = 'title';
            parent = await mysql.query(`SELECT DISTINCT units.id, units.name, units.display_name, units.description, units.course_id FROM units JOIN articles ON units.id=articles.unit_id WHERE articles.${nameOrId}=?`, [req.query.article]);
        } else {
            res.status(400).end();
        }
    } catch (err) {
        console.error(err);
        res.end();
    }
    if (parent != null && parent.length > 0) {
        res.send(parent);
    } else {
        res.status(404).end();
    }
};

exports.getChildren = async (req, res) => {
    let children;

    try {
        if (req.query.want) {
            switch (req.query.want) {
                case 'articles': {
                    if (req.query.subject) {
                        // Whether query refers to a name or id
                        const nameOrId = isNaN(req.query.subject) ? 'name' : 'id';
                        
                        children = await mysql.query(`SELECT articles.id, articles.\`order\`, articles.title, articles.display_title, articles.publish_date, articles.update_date, articles.content FROM articles JOIN units ON units.id=articles.unit_id JOIN courses ON courses.id=units.course_id JOIN subjects ON subjects.id=courses.subject_id WHERE subjects.${nameOrId}=?`, [req.query.subject]);
                    } else if (req.query.course) {
                        // Whether query refers to a name or id
                        const nameOrId = isNaN(req.query.course) ? 'name' : 'id';
                        
                        children = await mysql.query(`SELECT articles.id, articles.\`order\`, articles.title, articles.display_title, articles.publish_date, articles.update_date, articles.content FROM articles JOIN units ON units.id=articles.unit_id JOIN courses ON courses.id=units.course_id WHERE courses.${nameOrId}=?`, [req.query.course]);
                    } else if (req.query.unit) {
                        // Whether query refers to a name or id
                        const nameOrId = isNaN(req.query.unit) ? 'name' : 'id';
                        
                        children = await mysql.query(`SELECT articles.id, articles.\`order\`, articles.title, articles.display_title, articles.publish_date, articles.update_date, articles.content FROM articles JOIN units ON units.id=articles.unit_id WHERE units.${nameOrId}=?`, [req.query.unit]);
                    } else {
                        res.status(400).end();
                    }
                    
                    break;
                }
                case 'units': {
                    if (req.query.subject) {
                        // Whether query refers to a name or id
                        const nameOrId = isNaN(req.query.subject) ? 'name' : 'id';
                        
                        children = await mysql.query(`SELECT units.id, units.\`order\`, units.name, units.display_name, units.description FROM units JOIN courses ON courses.id=units.course_id JOIN subjects ON subjects.id=courses.subject_id WHERE subjects.${nameOrId}=?`, [req.query.subject]);
                    } else if (req.query.course) {
                        // Whether query refers to a name or id
                        const nameOrId = isNaN(req.query.course) ? 'name' : 'id';
                        
                        children = await mysql.query(`SELECT units.id, units.\`order\`, units.name, units.display_name, units.description FROM units JOIN courses ON courses.id=units.course_id WHERE courses.${nameOrId}=?`, [req.query.course]);
                    } else {
                        res.status(400).end();
                    }
                    
                    break;
                }
                case 'courses': {
                    if (req.query.subject) {
                        // Whether query refers to a name or id
                        const nameOrId = isNaN(req.query.subject) ? 'name' : 'id';
                        
                        children = await mysql.query(`SELECT courses.id, courses.\`order\`, courses.name, courses.display_name, courses.description FROM courses JOIN subjects ON subjects.id=courses.subject_id WHERE subjects.${nameOrId}=?`, [req.query.subject]);
                    } else {
                        res.status(400).end();
                    }
                    
                    break;
                }
                default:
                    res.status(400).end();
            }
        } else if (req.query.subject) {
            // Whether query refers to a name or id
            const nameOrId = isNaN(req.query.subject) ? 'name' : 'id';

            children = await mysql.query(`SELECT courses.id, courses.order, courses.name, courses.display_name, courses.description FROM courses JOIN subjects ON subjects.id=courses.subject_id WHERE subjects.${nameOrId}=?`, [req.query.subject]);
        } else if (req.query.course) {
            // Whether query refers to a name or id
            const nameOrId = isNaN(req.query.course) ? 'name' : 'id';

            children = await mysql.query(`SELECT units.id, units.order, units.name, units.display_name, units.description FROM units JOIN courses ON courses.id=units.course_id WHERE courses.${nameOrId}=?`, [req.query.course]);
        } else if (req.query.unit) {
            // Whether query refers to a name or id
            const nameOrId = isNaN(req.query.unit) ? 'name' : 'id';

            children = await mysql.query(`SELECT articles.id, articles.order, articles.title, articles.display_title, articles.publish_date, articles.update_date FROM articles JOIN units ON units.id=articles.unit_id WHERE units.${nameOrId}=?`, [req.query.unit]);

            children = children.map(data => {
                return data;
            });
        } else {
            res.status(400).end();
        }
    } catch (err) {
        console.error(err);
        res.end();
    }

    res.send(children);
};
