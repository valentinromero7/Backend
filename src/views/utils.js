const fs = require('fs');

function readDataFromFile(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading ${filename}: ${err}`);
        return [];
    }
}

function writeDataToFile(filename, data) {
    try {
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(`Error writing ${filename}: ${err}`);
    }
}

module.exports = { readDataFromFile, writeDataToFile };
