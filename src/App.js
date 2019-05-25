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
import "firebase/firestore";
import config from './config';

firebase.initializeApp(config);
var db = firebase.firestore();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user:null, width:0, height:0 };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  componentDidMount() {
      this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
          (user) => {
            this.setState({user: user});
            if (user) {
              //console.log("user:", user);
              db.collection("users").doc(user.uid).set({
                name:user.displayName
              }, { merge: true });
            }
          }
      );
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
  }
    
  componentWillUnmount() {
    this.unregisterAuthObserver();
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  render() {
    const params = { user:this.state.user, db:db };
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
            (this.state.user) ?
              <Route exact path="/decode/:encoded" render={(props) => <Decoder {...props} {...params} />} />
              : "" 
          }
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
