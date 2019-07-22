import React from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Redirect } from 'react-router-dom';
import Header from './Header';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing(10),
  },
});

const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: (result) => {
        const { additionalUserInfo, credential } = result;
        if (additionalUserInfo && credential 
          && credential.providerId === firebase.auth.TwitterAuthProvider.PROVIDER_ID) {
            console.log("Twitter user name=", additionalUserInfo.username);
        }
        return false;
      }
    }
};

function Login(props) {
  const { classes, match, user } = props;
  const { target, encoded } = match.params;

  if (!user) {
    return <React.Fragment>
      <Header />
      <div className={classes.root}>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
      </div>
    </React.Fragment>
  }
  if (encoded) {
    return <Redirect to={"/decode/"+encoded} />
  } else if (target) {
    return <Redirect to={"/"+target} />
  }
  return <Redirect to={"/"} />
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);