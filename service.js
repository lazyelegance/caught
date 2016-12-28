var http = require('http');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./keys.txt');

function getMatches() {
  (function(callback) {
    'use strict';

    console.log(properties.get('bowled.hostname'));
    console.log(properties.get('bowled.port'));
    console.log(properties.get('bowled.matchesPath'));
    console.log(properties.get('bowled.mashapeKey'));

    const httpTransport = require('https');
    const responseEncoding = 'utf8';
    const httpOptions = {
        hostname: properties.get('bowled.hostname'),
        port: properties.get('bowled.port'),
        path: properties.get('bowled.matchesPath'),
        method: 'GET',
        headers: {"X-Mashape-Key":properties.get('bowled.mashapeKey')}
    };
    httpOptions.headers['User-Agent'] = 'node ' + process.version;

    // Paw Store Cookies option is not supported

    const request = httpTransport.request(httpOptions, (res) => {
        let responseBufs = [];
        let responseStr = '';

        res.on('data', (chunk) => {
            if (Buffer.isBuffer(chunk)) {
                responseBufs.push(chunk);
            }
            else {
                responseStr = responseStr + chunk;
            }
        }).on('end', () => {
            responseStr = responseBufs.length > 0 ?
                Buffer.concat(responseBufs).toString(responseEncoding) : responseStr;

            callback(null, res.statusCode, res.headers, responseStr);
        });

    })
    .setTimeout(0)
    .on('error', (error) => {
        callback(error);
    });
    request.write("")
    request.end();


})((error, statusCode, headers, body) => {
    console.log('ERROR:', error);
    console.log('STATUS:', statusCode);
    console.log('HEADERS:', JSON.stringify(headers));
    console.log('BODY:', body);
});
}

exports.getMatches = getMatches;
