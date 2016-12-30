var http = require('http');
const save = require('./save');



function getMatches() {
  (function(callback) {
    'use strict';

    // TEST
    // console.log(properties.get('bowled.hostname'));
    // console.log(properties.get('bowled.port'));
    // console.log(properties.get('bowled.matchesPath'));
    // console.log(properties.get('bowled.mashapeKey'));

    const httpTransport = require('https');
    const responseEncoding = 'utf8';
    const httpOptions = {
        hostname: process.env.APIURL,
        port: process.env.APIPORT,
        path: process.env.MATCHESURL,
        method: 'GET',
        headers: {"X-Mashape-Key": process.env.APIKEY}
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
  if (error == null) {
    console.log("SUCCESS");
    console.log('HEADERS:', headers);
    // console.log('BODY:', JSON.parse(body));
    var results = JSON.parse(body);
    console.log(results.matchList.matches.length);
    save.tester();
    save.saveToFB(results.matchList.matches);
  }
    // console.log('ERROR:', error);
    console.log('STATUS:', statusCode);
    // console.log('HEADERS:', JSON.stringify(headers));
    // console.log('BODY:', body);
});
}

exports.getMatches = getMatches;
