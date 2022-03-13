const express   = require('express');
const path      = require('path');
const db_status = require('../middleware/check_db_status');
const app = express();

var unless = function(paths, middleware) {
    return function(req, res, next) {
        if (paths.includes(req.path)) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};

app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, '../../public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(unless(['/db/default', '/db/import', '/db/export'], db_status.checkDBStatus));
require('../app.controller')(app);

const port = process.env.PORT || 3000;
const httpServer = require('http').createServer(app);
httpServer.listen(port, async () => {
    console.log('Server running on port ' + port);
})
