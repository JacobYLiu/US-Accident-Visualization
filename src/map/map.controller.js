module.exports = (app) => {
    app.get('/map', (req, res) => {
        res.render('map.ejs');
    })
}
