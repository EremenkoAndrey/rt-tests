const config = require('./config');
const fs = require('fs');

function saveLinks(jsonWithLinks) {
    var filename = config.resultDir + 'links.json';

    fs.appendFile(filename, jsonWithLinks, function (err) {
        if (err) {
            console.log('Проверка завершена успешно, файл ' + filename + ' не создан');
        } else {
            console.log('Проверка завершена успешно, создан файл ' + filename + ' со списком найденных УРЛов');
        }

    });
}

module.exports = saveLinks;
