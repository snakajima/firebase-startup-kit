import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';

admin.initializeApp();

const app = express();
app.use(cors());

app.put('/api/username', async (req, res) => {
    const db = admin.firestore();
    const { name, uid } = req.query;
    //const info = {a:1, b:req.query.name, c:req.query.uid};
    const ref = db.collection("usernames").doc(name);
    const doc = await ref.get();
    const data = doc.data();
    if (data) {
        if (data.uid === uid) {
            res.json({result:"already have it"});
        } else {
            res.json({result:"not available"});
        }
    } else {
        await ref.set({uid});
        res.json({result:"got it"});
    }
});

app.put('/api/2', (request, res) => {
    res.send("Hello from Firebase! 2");
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const api = functions.https.onRequest(app);
