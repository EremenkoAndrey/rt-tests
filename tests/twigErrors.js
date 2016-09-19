const fs = require('fs');

function twigErrors(content, url) {
    var filename = './logs/twig-errors.txt'
    var arrKeywords = [
        'CException'
    ];

    arrKeywords.forEach(function(word) {

        if(findKey(word)) {
            var string = 'Ошибка шаблона TWIG "' + word + '" на странице ' + url + ' \n \n';
            fs.appendFile(filename, string, function (err) {
                if (err) {
                    console.log('keywordsSearch: ошибка записи в файл');
                }
            });
        }
    });

    function findKey(keyword) {
        var regExp = new RegExp(keyword, "g");
        return content.match(regExp) !== null;
    }

};

module.exports = twigErrors;
