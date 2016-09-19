const fs = require('fs');
const phantom = require('phantom');
const async = require('async');
const colors = require('colors');
const argv = require('minimist')(process.argv.slice(2));
const config = require('./config');
const urls = require('./urls');
const urlParser = require('url');

const saveLinks = require('./saveLinks');
const jsErrors = require('./tests/jsErrors');
const resource404 = require('./tests/404');
const keywords = require('./tests/keywords');

var links = [],
    maxCount,
    limit,
    counter = 0;

if(argv._.length > 0) {
    tests({
        url: argv._[0],
        count: argv.count || argv._[1]
    }, function (err) {

        if(err){
            console.log(colors.red('Возникли ошибки при проверке'));
        } else {
            var jsonLinksObj = JSON.stringify(urls.getHash());
            saveLinks(jsonLinksObj);
        }
    });
}

function tests(post, callback) {
    var parsedUrl = urlParser.parse(post.url),
        host = parsedUrl.protocol + '//' + parsedUrl.host,
        tests = {
            beforeOpen: function (page) {
                jsErrors(page);
                resource404(page);
            },
            afterOpen: function (content, url) {
                keywords(content, post.keywords, url);
            }
        };

    maxCount = parseInt(post.count) || 100;
    limit = 5;


    if (!parsedUrl.protocol || !parsedUrl.host) {
        throw new Error('Incorrect URL');
    }

    clear().then(function () {

        checkPage(post.url, tests).then(function () {

            async.eachOfLimit(links, limit, function (link, key, callback) {
                if(key < maxCount) {
                    var url = host + link;
                    checkPage(url, tests).then(function () {
                        callback();
                    });
                } else {
                    callback();
                }

            }, callback);
        }).catch(function (err, url) {
            console.log('checkPage: error on url ' + url, err);
        });

    });
}

function checkPage(url, tests) {
    return new Promise(function (resolve, reject) {

        var sitepage = null;
        var phInstance = null;

        phantom.create().then(function (instance) {
            phInstance = instance;
            return instance.createPage();
        }).then(function (page) {
            return page;
        }).then(function (page) {
            sitepage = page;
            tests.beforeOpen(sitepage);
            return page.open(url);
        }).then(function (status) {
            return sitepage.property('content');
        }).then(function (content) {
            if(links.length < maxCount) {
                links = links.concat(urls.findUrl(content, url));
            };
            tests.afterOpen(content, url);
            sitepage.close();
            phInstance.exit();
            console.log(colors.green(counter++ + ') Проверка страницы ' + url + ' завершена успешно'));
            resolve();
        }).catch(function (error) {
            console.log(error);
            phInstance.exit();
            console.log(colors.red('Проверка страницы ' + url + ' завершена с ошибкой'));
            reject(error, url);
        });
    });

}

function clear() {
    links.length = 0;
    urls.clearHash();
    counter = 0;

    return new Promise(function (resolve, reject) {

        var dirName = config.resultDir;
        fs.readdir(dirName, function (err, fileNames) {
            if(err) {
                console.log('Log directory is not cleared');
                resolve();
            } else {
                async.each(fileNames, function (filename, callback) {
                    var path = dirName + filename;
                    fs.unlink(path, function(err){
                        if(err) {
                            console.log(colors.red('File' + path + 'is not deleted'));
                            reject();
                        }
                        callback();
                    });
                }, function () {
                    console.log('Директория логов очищена');
                    resolve();
                });
            }
        });

    });

}

module.exports = {
    start: tests,
    clear: clear
};