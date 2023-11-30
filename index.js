
const fs = require('fs');
const { parser } = require('./parser');

if (process.argv.length !== 3 || !process.argv[2].length) {
    console.error('no file found');
}

const file = require(process.argv[2]);
const output = parser(file);

fs.writeFile(
    './result.json',
    JSON.stringify(output),
    'utf-8',
    (e) => {
        if (!e) console.log('successfully parsed shift data, exported to result.json')
    }
);
