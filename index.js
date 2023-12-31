
const fs = require('fs');
const { parser } = require('./parser');

if (process.argv.length !== 3 || !process.argv[2].length) {
    console.error('no file found');
    process.exit(1);
}

let fileObj;
try {
    fileObj = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
} catch (e) {
    console.log('error reading json file');
    process.exit(1);
}
const output = parser(fileObj);

if (output) {
    fs.writeFile(
        './result.json',
        JSON.stringify(output),
        'utf-8',
        (e) => {
            if (!e) console.log('successfully parsed shift data, exported to result.json')
            else console.log('could not export result to file', output);
        }
    );
} else {
    console.log('json file format is invalid');
}
