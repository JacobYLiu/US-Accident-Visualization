const dbService = require('./db.service');
const path = require('path');
const fs = require('fs');
const csv2json  = require('../utils/csv2json');
const db        = require('../db/db_manager');

module.exports = (app) => {
    app.get('/db', (req, res) => {
        res.render('db.ejs');
    });

    app.get('/db/default', async (req, res) => {
        try {
            const filePath = path.join(__dirname, '../../accidents.csv');
            const data = await csv2json(filePath, 0);
            db.collection = data;
            db.total = data.rows.size;
            res.status(200).json({ message: 'Finished importing' });
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    });

    app.get('/db/export', async (req, res) => {
        await dbService.exportToCSV();
        const filePath = path.join(__dirname, '../../accidents-cp.csv');
        res.download(filePath);
    });

    app.post('/db/import', async (req, res) => {
        const writeStream = fs.createWriteStream('./accidents-user.csv');
        req.pipe(writeStream);

        writeStream.on('finish', async () => {
            if (db.collection)
                db.collection.rows.clear();
            const filePath = path.join(__dirname, '../../accidents-user.csv');
            const data = await csv2json(filePath, 4);
            console.log('Populated DB');
            db.collection = data;
            db.total = data.rows.size;
            res.json({ message: 'Finished importing' });
        })

        writeStream.on('error', err => {
            res.status(500).json({ error: err.message });
        })
    });
}
