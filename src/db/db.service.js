const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const Database = require('./db_manager');

exports.exportToCSV = async () => {
    const filePath = path.join(__dirname, '../../accidents-cp.csv');
    const writeFileAsync = promisify(fs.writeFile);
    const appendFileAsync = promisify(fs.appendFile);
    await writeFileAsync(filePath, '');

    const rows = Database.collection.rows;
    let addedFields = false;
    for (let [key, value] of rows) {
        const accident = Object.fromEntries(value.values);
        if(!addedFields) {
            const fields = Object.keys(accident);
            await appendFileAsync(filePath, fields.join(',') + '\r\n');
            addedFields = true;
        }
        await appendFileAsync(filePath, Object.values(accident).join(',') + '\r\n');

    }
    return 'Success';
}
