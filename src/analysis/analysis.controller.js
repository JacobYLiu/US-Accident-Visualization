module.exports = (app) => {
    app.get('/analysis', (req, res) => {
        res.render('analysis.ejs');
    });
}