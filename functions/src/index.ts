import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';

admin.initializeApp();
const app = express();
app.use(cors());

// https://github.com/firebase/functions-samples/blob/master/authorized-https-endpoint/public/main.js

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = async (req:any, res:any, next:any) => {
    console.log('Check if request is authorized with Firebase ID token');
  
    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
        !(req.cookies && req.cookies.__session)) {
      console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
          'Make sure you authorize your request by providing the following HTTP header:',
          'Authorization: Bearer <Firebase ID Token>',
          'or by passing a "__session" cookie.');
      res.status(403).json({result:'Unauthorized (1)'});
      return;
    }
  
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      console.log('Found "Authorization" header');
      // Read the ID Token from the Authorization header.
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else if(req.cookies) {
      console.log('Found "__session" cookie');
      // Read the ID Token from cookie.
      idToken = req.cookies.__session;
    } else {
      // No cookie
      res.status(403).json({result:'Unauthorized (2)'});
      return;
    }
  
    try {
      const decodedIdToken = await admin.auth().verifyIdToken(idToken);
      console.log('ID Token correctly decoded', decodedIdToken);
      req.user = decodedIdToken;
      next();
      return;
    } catch (error) {
      console.error('Error while verifying Firebase ID token:', error);
      res.status(403).json({result:'Unauthorized (3)'});
      return;
    }
};

app.use(validateFirebaseIdToken);

app.put('/api/username', async (req:any, res) => {
    const { name } = req.query;
    const uid:any = req.user.uid;
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
            let message = "got it";
            if (docUID && docUID.name) {
                const refNamePrev = db.collection("usernames").doc(docUID.name);
                await tr.delete(refNamePrev)
                message = "updated it from:" + docUID.name;
            }
            await tr.set(refName, {uid});
            await tr.set(refUID, {name});
            await res.json({result:message + " by " + uid});
        }
    }
    
    try {
        await db.runTransaction(operation);
    } catch(err) {
        res.json({result:"something went wrong"});
    }
});

export const api = functions.https.onRequest(app);
