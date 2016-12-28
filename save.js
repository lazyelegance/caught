
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./keys.txt');

var admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(process.env.FIREBASE_CRED),
  databaseURL: process.env.FIREBASEDB
});


var db = admin.database();
var ref = db.ref("hello");

function tester() {
  ref.once("value", function(snapshot) {
    console.log(snapshot.val());
  });
}

var matchesRef = db.ref("matches");

function saveToFB(results) {
  for (var i = 0; i < results.length; i++) {
    matchesRef.child(results[i].id).set(results[i]);
  }
}

exports.tester = tester;
exports.saveToFB = saveToFB
