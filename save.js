

var admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert("./caught-1d629-firebase-adminsdk-rn0ek-c78a1b7d40.json"),
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
