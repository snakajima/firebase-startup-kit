import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import Header from './Header';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(10),
  },
}));

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
    signInSuccessWithAuthResult: result => {
      const { additionalUserInfo, credential } = result;
      if (
        additionalUserInfo &&
        credential &&
        credential.providerId === firebase.auth.TwitterAuthProvider.PROVIDER_ID
      ) {
        console.log('Twitter user name=', additionalUserInfo.username);
      }
      return false;
    },
  },
};

const Login = props => {
  const classes = useStyles();
  const { match, user } = props;
  const { target, encoded } = match.params;

  if (!user) {
    return (
      <>
        <Header />
        <div className={classes.root}>
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </div>
      </>
    );
  }
  if (encoded) {
    return <Redirect to={`/decode/${encoded}`} />;
  } else if (target) {
    return <Redirect to={`/${target}`} />;
  }
  return <Redirect to={'/'} />;
};

Login.propTypes = {
  classes: PropTypes.object,
};

export default Login;
