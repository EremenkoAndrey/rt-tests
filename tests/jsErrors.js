function jsErrorsFinder(page){
    page.property('onError', writeToFile);
}

function writeToFile(msg, trace) {

    try {
        const fs = require('fs'),
            path = './logs/js-errors.txt';

        var string = 'URL: ' + this.url + ' \n ' + msg + ' \n ' + 'Trace: ' + JSON.stringify(trace) + ' \n \n';
        var stream = fs.open(path, 'a+');
        stream.write(string);
        stream.close();

    } catch (err) {
        console.log('phantom: fileWrite has trouble ', err);
    }

}

module.exports = jsErrorsFinder;