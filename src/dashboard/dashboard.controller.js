const fs = require('fs');
const path = require('path');
const readline = require('readline');
const Database = require('../db/db_manager');

module.exports = (app) => {
    app.get('/', (req, res) => {
        res.render('dashboard.ejs');
    });

    app.get('/stream', async (req, res) => {
        res.header('Content-Type', 'text/event-stream');
        res.header('Connection', 'keep-alive');
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        const rows = Database.collection.rows;
        for (let [key, value] of rows) {
            const accident = Object.fromEntries(value.values);
            res.write(JSON.stringify(accident));
            await delay(0);
        };
        res.end();
    })

    app.get('/download', (req, res) => {
        const filePath = path.join(__dirname, '../../accidents.csv');
        res.download(filePath);
    })

}
