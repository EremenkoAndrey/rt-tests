const cheerio = require('cheerio');

var hashLib = {};

function findUrl(string, url) {
    var $ = cheerio.load(string);
    var links = [];

    $('a').each(function (index, value) {
        var link = $(value).attr('href');

        if (typeof (link) === 'string' &&
            link.search(/^\/\w/) !== -1){

            link = link.trim();

            if(!hashLib[link]) {
                hashLib[link] = [url];
                links.push(link);
            } else {
                hashLib[link].push(url);
            }
        }
    });

    return links;
};

function getHash() {
    return hashLib;
}

function clearHash() {
    hashLib = {};
}

module.exports = {
    findUrl: findUrl,
    getHash: getHash,
    clearHash: clearHash
};
