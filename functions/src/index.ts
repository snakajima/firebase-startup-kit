import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';

admin.initializeApp();
const app = express();
app.use(cors());

app.put('/api/username', async (req, res) => {
    const { name, uid } = req.query;
    const db = admin.firestore();
    const ref = db.collection("usernames").doc(name);

    const operation = async (tr:admin.firestore.Transaction) => {
        try {
            const doc = await tr.get(ref);
            const data = doc.data();
            if (data) {
                if (data.uid === uid) {
                    await res.json({result:"already have it"});
                } else {
                    await res.json({result:"not available"});
                }
            } else {
                await tr.set(ref, {uid});
                await res.json({result:"got it"});
            }
        } catch(err) {
            // do nothing
        }
    }
    try {
        await db.runTransaction(operation);
    } catch(err) {
            // do nothing
    }
});

export const api = functions.https.onRequest(app);
