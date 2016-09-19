function resource404Finder(page){
    page.property('onResourceReceived', writeToFile);
}

function writeToFile(response) {

    try {
        const fs = require('fs'),
            pathForPages = './logs/pages404.txt',
            pathForResources = './logs/resources404.txt';

        if(this.url === response.url && response.status === 404) {
            var stream = fs.open(pathForPages, 'a+');
            stream.write('URL: ' + this.url + ' \n \n');
            stream.close();
        } else if (this.url && response.status === 404) {
            var stream = fs.open(pathForResources, 'a+');
            stream.write('URL:' + this.url + '. Resource: ' + response.url + ' Status 404' + ' \n \n');
            stream.close();
        }

    } catch (err) {
        console.log('phantom: fileWrite has trouble ', err);
    }

}

module.exports = resource404Finder;
