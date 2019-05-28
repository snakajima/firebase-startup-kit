import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';

admin.initializeApp();

const app = express();
app.use(cors());

app.put('/api/username', (req, res) => {
    const info = {a:1, b:req.query.name, c:req.query.uid};
    res.json(info);
});

app.put('/api/2', (request, res) => {
    res.send("Hello from Firebase! 2");
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const api = functions.https.onRequest(app);
