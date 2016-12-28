

var admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIR_PROJECT_ID,
    clientEmail: process.env.FIR_CLIENT_EMAIL,
    private_key: process.env.FIR_PRIVATE_KEY,
    private_key_id: process.env.FIR_KEY_ID,
    client_id: process.env.FIR_CLIENT_ID,
    client_x509_cert_url: process.env.FIR_CERT_URL,
    auth_provider_x509_cert_url: process.env.FIR_AUTH_CERT_URL
  }),
  databaseURL: process.env.FIREBASEDB
});

admin.credential.cert({

})

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
