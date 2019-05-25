import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import theme from './theme';
import Home from './Home';
import About from './About';
import Login from './Login';
import Decoder from './Decoder';
import * as firebase from "firebase/app";
import config from './config';

firebase.initializeApp(config);
var db = firebase.firestore();

class App extends React.Component {
  state = {user:null};
  render() {
    const params = {};
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Route exact path="/" render={(props) => <Home {...props} params={params} />} />
          <Route exact path="/about" render={(props) => <About {...props} params={params} />} />
          <Route exact path="/login" render={(props) => <Login {...props} params={params} />} />
          <Route exact path="/login/cmd/:encoded" render={(props) => <Login {...props} params={params} />} />
          <Route exact path="/login/target/:target" render={(props) => <Login {...props} params={params} />} />
          { // We need to mount the Decoder component only after the user info became available.
            (this.state.user) ?
              <Route exact path="/decode/:encoded" render={(props) => <Decoder {...props} params={params} />} />
              : "" 
          }
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
