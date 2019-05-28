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
    const refName = db.collection("usernames").doc(name);
    const refUID = db.collection("uids").doc(uid);

    const operation = async (tr:admin.firestore.Transaction) => {
        const dataName = (await tr.get(refName)).data();
        const docUID = (await tr.get(refUID)).data();
        if (dataName) {
            if (dataName.uid === uid) {
                await res.json({result:"already have it"});
            } else {
                await res.json({result:"not available"});
            }
        } else {
            var message = "got it";
            if (docUID && docUID.name) {
                const refNamePrev = db.collection("names").doc(docUID.name);
                await tr.delete(refNamePrev)
                message = "updated it from " + docUID.name;
            }
            await tr.set(refName, {uid});
            await tr.set(refUID, {name});
            await res.json({result:message});
        }
    }
    
    try {
        await db.runTransaction(operation);
    } catch(err) {
        res.json({result:"something went wrong"});
    }
});

export const api = functions.https.onRequest(app);
