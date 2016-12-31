var admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert({
    projectId: process.env.FIR_PROJECT_ID,
    clientEmail: process.env.FIR_CLIENT_EMAIL,
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCzVJX40WHxtxAi\nk2p38gdov99Z+Vn3rFxeYMesPOsFuyBks6SPX7Iw9kPZV7DyRiMi1FRU14SgIHVv\nF1PW8gGPB9sTYy5t5iFNIv3ag5s9POjdQjF6rhvMrrUlYpSclu2F8eZhZxOjJCnC\nEo56QixBLljTOGN7pN8cPoNNdo4k1P1Cy5iNZG9R1LrfZiVG6Gm7vSZ/O0W6G5QU\nq0OoymxFvFataBwMVYeWGdv8k46S83bXbS8RecS1LLIpIBw18W9g8VV0B3NOCJxg\nN9lP2rp9daUhz5eldQzr4pr2p/zARktqGvXH1r+4rntFgjr5RDa5BVb1ph+jDZct\nbrcfZC6lAgMBAAECggEAVyKujGwQz0ZIDMTcYtOzTe6NNEa4tGOHrkQQQVyIRgya\nvNOdDh1NlATVCvJVBCOYRwAsydy+kJ+07/nBvxtwLnN+u3jhwnyjibuK5XY1JBhI\nfdn/+MBIubfaRQQVedDMMN1NN97B5+9WavphSH6GylUey+MGU7nUvwCRBD6q6rHS\ni+FvkujVF9qYCKFKKfTsKgvoCIdApohVuLQNZkpHhX8RDV9epwaOqxK7x4hcvxtc\nVcSc3JAzEb7v16tfhXEqvdHapoIp1EHTzMaH6Od+q/dp6CixAAz0h37hoYQtPaJR\nNjgWvus5b+atv3UvhW1w0LX80OaUOqWciWSXxX50MQKBgQDkI7ZeRoHlRSyeIB26\nB7ZTmHvgcOzUTA2q2RiaAb1umIppOj9PSBSEWHPLHa99ad2AwOUjFy3HvW4zukY7\nZQMc2L1vwOfRB9znOpi5gH/48k2RmY4dPPKI8/VGvYIfxziSMTVz3KVqEYSEvO1J\nLCwlyuIYQ04bdZaaoYLQmt93YwKBgQDJOvaFtsFKBRH5J+kNOf5cgUfhmDuGgqit\n9Z4gMhljjQyzoOIFyyAy+wI0Sgk87hwC4JjPvRgO1M5FJA+N6NFhPF9OHBvea4Hr\nX97zLlF3VIFkid/4MxTrq5+xifm40Gk4AxZ5eC8tXhpSUuu2MZN/d8c7bPRSPo6x\nTshLJsu0VwKBgFW28TrkhMNORSA38tNFOISaAtjltKVi2bO6E1sxkimuWDqG7uhr\nrYG39fF3esrE7rsEPlL7z3B/RJtcvixsnEnHSQ1mzfIkYSPjSSRRGkO/TdOJfPKR\nRpKcDiiA5RXpdODAalPYr7F1WXPBw+k9Fm0wl9gD2aHJgUchrZOQzKr/AoGAUyR/\nkwPNnQ23PWDWE9bwV7w6vOUvQwZdN3MSYG8SumUe6GECwi4JIcdAQ+aLJpejDzVJ\nLhwNAqO+jia2HoYhbLGLFzTZ9u4ogd3culFa65kI1Ud6OIyyiiUhGDPP8CJ8Nt5f\nvNSBeZc1/Omx5ldZgAM3WEBOOmUKhAvvCc3/wIUCgYAg30JFmd8r0PCBUGxSaWOE\nLgwhmnmVXSASltkGkCmxaVpGosssuuQh9RVA+cdDLSnulmxIKcUsASXV4rANgM1m\nFqJEOzHAyRRFDt8pvX9w3DMvwzLJA+LI4RfdqDmeG0IVjsCwJEEIuGT1YxBk/XOC\nuydTj6nKDOR8/NfEBEaE/w==\n-----END PRIVATE KEY-----\n"
  }),
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
var teamsRef = db.ref("teams");

function saveToFB(results) {

  for (var i = 0; i < results.length; i++) {
    matchesRef.child(results[i].id).set(results[i]);
    var teamType = results[i].cmsMatchType;
    var homeTeamKey = results[i].homeTeam.name.toUpperCase();
    var awayTeamKey = results[i].awayTeam.name.toUpperCase();

    var isInternational = false;


    if (results[i].cmsMatchType == 'One-Day International' || results[i].cmsMatchType == 'T20 International' || results[i].cmsMatchType == 'Test') {
      isInternational = true;
      if (results[i].isWomensMatch) {
        teamType = "International Women";
      } else {
        teamType = "International";
        homeTeamKey = results[i].homeTeam.name.split('Men')[0].trim().toUpperCase();
        awayTeamKey = results[i].awayTeam.name.split('Men')[0].trim().toUpperCase();
      }
    } else if (results[i].cmsMatchType == 'WBBL') {
      homeTeamKey = results[i].homeTeam.name.replace('WBBL', 'Women').toUpperCase();
      awayTeamKey = results[i].awayTeam.name.replace('WBBL', 'Women').toUpperCase();
    } else if (results[i].cmsMatchType == 'BBL') {
      homeTeamKey = results[i].homeTeam.name.split('BBL')[0].trim().toUpperCase();
      awayTeamKey = results[i].awayTeam.name.split('BBL')[0].trim().toUpperCase();
    }

    if (teamType != undefined) {
      if (results[i].homeTeam.name != 'To Be Decided') {
        teamsRef.child(teamType).child(homeTeamKey).set({
          "id": results[i].homeTeam.id,
          "name": homeTeamKey,
          "shortName": results[i].homeTeam.shortName,
          "logoUrl": results[i].homeTeam.logoUrl,
          "teamColour": results[i].homeTeam.teamColour,
          "isWomensTeam": results[i].isWomensMatch,
          "isInternational": isInternational
        });
      }

      if (results[i].awayTeam.name != 'To Be Decided') {
        teamsRef.child(teamType).child(awayTeamKey).set({
          "id": results[i].awayTeam.id,
          "name": awayTeamKey,
          "shortName": results[i].awayTeam.shortName,
          "logoUrl": results[i].awayTeam.logoUrl,
          "teamColour": results[i].awayTeam.teamColour,
          "isWomensTeam": results[i].isWomensMatch,
          "isInternational": isInternational
        });
      }
    }
  }
}

exports.tester = tester;
exports.saveToFB = saveToFB;
