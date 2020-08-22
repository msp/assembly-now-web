const functions = require('firebase-functions');
const admin = require('firebase-admin');
const uuid = require('uuid');
const cors = require('cors')({
  origin: true,
});

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const db = admin.firestore();
const ref = db.doc('config/waiting_room');

exports.getRoomId = functions.https.onRequest(async (req, res) => {
  await cors(req, res, async () => {
    await db.runTransaction(async transaction => {
      const existingRoom = await transaction.get(ref);
      console.log(existingRoom);
      if(!existingRoom.exists) {
        throw(new Error("waiting_room doc does not exist"));
      }

      if(existingRoom.data().roomId !== "") {
        const roomId = existingRoom.data().roomId;
        await transaction.update(ref, {"roomId": ""});
        res.json({ data: { room: roomId, role: 'callee' }});
      } else {
        const roomId = uuid.v4();
        await transaction.update(ref, {"roomId": roomId});
        res.json({ data: { room: roomId, role: 'caller' }});
      }
    });
  });
});