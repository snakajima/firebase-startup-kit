import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';

admin.initializeApp();

const app = express();

app.get('/api', (request, res) => {
    res.send("Hello from Firebase! 0");
});

app.get('/api/1', (request, res) => {
    res.send("Hello from Firebase! 1");
});

app.get('/api/2', (request, res) => {
    res.send("Hello from Firebase! 2");
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const api = functions.https.onRequest(app);
