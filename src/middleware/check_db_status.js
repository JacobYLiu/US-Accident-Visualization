const db = require('../db/db_manager');

exports.checkDBStatus = (req, res, next) => {
    if (!db.collection)
        return res.render('choose_db.ejs');
    next();
}
