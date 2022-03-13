const dashboardRoute = require('./dashboard/dashboard.controller');
const searchRoute = require('./search/search.controller');
const mapRoute = require('./map/map.controller');
const accidentsRoute = require('./accidents/accidents.controller');
const dbRoute = require('./db/db.controller');
const analysisRoute = require('./analysis/analysis.controller');

module.exports = (app) => {
    dashboardRoute(app);
    searchRoute(app);
    mapRoute(app);
    accidentsRoute(app);
    dbRoute(app);
    analysisRoute(app);
}
