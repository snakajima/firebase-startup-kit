import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import theme from './theme';
import Home from './Home';
import About from './About';
import Login from './Login';
import Decoder from './Decoder';
import * as firebase from "firebase/app";
import "firebase/firestore";
import config from './config';

firebase.initializeApp(config);
const db = firebase.firestore();

function App() {
  const [user, setUser] = useState(null);

  useEffect(()=>{
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      async (user) => {
        setUser(user);
        if (user) {
          const refUser = db.collection("users").doc(user.uid);
          const newValue = { lastAccessed:firebase.firestore.FieldValue.serverTimestamp() };
          const doc = (await refUser.get()).data();
          if (!doc || !doc.name) {
            newValue.name = user.displayName;
          }
          await refUser.set(newValue, { merge: true });
        }
      }
    );
    return unregisterAuthObserver;
  }, []);
    
  const params = { user, db };
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Route exact path="/" render={(props) => <Home {...props} {...params} />} />
        <Route exact path="/about" render={(props) => <About {...props} {...params} />} />
        <Route exact path="/login" render={(props) => <Login {...props} {...params} />} />
        <Route exact path="/login/cmd/:encoded" render={(props) => <Login {...props} {...params} />} />
        <Route exact path="/login/target/:target" render={(props) => <Login {...props} {...params} />} />
        { // We need to mount the Decoder component only after the user info became available.
          (user) ?
            <Route exact path="/decode/:encoded" render={(props) => <Decoder {...props} {...params} />} />
            : "" 
        }
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
