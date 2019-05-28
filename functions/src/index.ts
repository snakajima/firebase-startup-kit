import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';

admin.initializeApp();

const app = express();
app.use(cors());

app.put('/api/1', (request, res) => {
    const info = {a:1, b:"abcd", c:[1,2,3]};
    res.json(info);
});

app.put('/api/2', (request, res) => {
    res.send("Hello from Firebase! 2");
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const api = functions.https.onRequest(app);
