const fs = require('fs');

function keywordsSearch(content, keywords, url) {
    if(!keywords) return;

    var arrKeywords = keywords.split(',');

    arrKeywords.forEach(function(item) {
        var word = item.trim(),
            filename = './logs/keywords.txt',
            string = '';

        if(findKey(word)) {
            string = 'Найдено слово "' + word + '" на странице ' + url + ' \n \n';
            fs.appendFile(filename, string, function (err) {
                if (err) {
                    console.log('keywordsSearch: ошибка записи в файл');
                }
            });
        }
    });

    function findKey(keyword) {
        var regExp = new RegExp(keyword, "ig");
        return content.match(regExp) !== null;
    }

};

module.exports = keywordsSearch;

