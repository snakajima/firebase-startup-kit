import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';

admin.initializeApp();

const app = express();

app.get('/api/1', (request, res) => {
    const info = {a:1, b:"abc", c:[1,2,3]};
    res.header("Access-Control-Allow-Origin", "http://localhost:3888");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.send(JSON.stringify(info));
});

app.get('/api/2', (request, res) => {
    res.send("Hello from Firebase! 2");
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const api = functions.https.onRequest(app);
