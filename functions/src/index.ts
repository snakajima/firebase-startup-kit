import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send("Hello from Firebase!");
});
