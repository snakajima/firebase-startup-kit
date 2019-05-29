import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Header from './Header';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import * as firebase from "firebase/app";
import "firebase/auth";

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(1),
    paddingTop: theme.spacing(10),
  },
  caption: {
    textAlign: "center",
    width: "100%",
  },
});

class Account extends React.Component {
  state = { name: undefined, label: "", indicator:{} };

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    const { user, db } = this.props;

    if (user && this.state.name===undefined) {
      const ref = db.collection("uids").doc(user.uid);
      this.detacher = ref.onSnapshot((doc) => {
        const data = doc.data();
        console.log(data);
        if (data && data.name) {
          this.setState({name:data.name});
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.detacher) {
      this.detacher();
    }
  }

  async handleChange(name) {
    const { db, user } = this.props;
    this.setState({name:name});
    if (name.length === 0) {
      this.setState({label:"user name", indicator:{}});
      return;
    }
    if (name.length < 4) {
      this.setState({label:"Minimum 4 characters", indicator:{error:true}});
      return;
    }
    const ref = db.collection("usernames").doc(name);
    const doc = await ref.get();
    if (name !== this.state.name) {
      // ASYNC HACK: Ignore if it has been changed already.
      console.log("async case")
      return;
    }

    const data = doc.data();
    if (data && data.uid !== user.uid) {
      this.setState({label:"Not available", indicator:{error:true}});
      return;
    }
    this.setState({label:"Available", indicator:{}});
  }

  async handleUpdate(e) {
    const { config } = this.props;
    console.log("handleUpdate");
    e.preventDefault();

    this.setState({label:"Requesting...", indicator:{}});
    const token = await firebase.auth().currentUser.getIdToken();
    var options = {
      method: 'PUT',
      headers: {
        Authorization : 'Bearer ' + token,
        //pragma: 'no-cache',
        //'cache-control': 'no-cache',
      },
    };
    const query = "name=" + encodeURIComponent(this.state.name);
    const res = await fetch("https://" + config.projectId + ".firebaseapp.com/api/username?" + query, options);
    const json = await res.json();
    console.log("res.json()=", json);
    this.setState({label:json.result, indicator:{ error:(res.status >=400) }});
  }

  render() {
    const { classes, user } = this.props;
    if (!user) {
      return (
        <React.Fragment>
        <Header user={user} login="/Login/target/about" />
        <Grid container justify="center" alignItems="center" direction="row" className={classes.root}>
          <Grid item className={classes.caption}>
            <Button variant="contained" color="primary" className={classes.button}component={Link} to="/login/target/account">
                Login
            </Button>
          </Grid>
        </Grid>
        </React.Fragment>
      )
    }
    return (
      <React.Fragment>
        <Header user={user} login="/Login/target/about" />
        <Grid container justify="center" alignItems="center" direction="row" className={classes.root}>
          <Grid item>
            <Grid container direction="row">
            <form>
            <Grid item className={classes.caption}>
                <Typography component="h2" variant="h5" gutterBottom>
                  Account Page. 
                </Typography>
                <TextField {...this.state.indicator} label={this.state.label} value={this.state.name || ""}
                        className={classes.textField} margin="normal" 
                        onChange = {(e)=>this.handleChange(e.target.value)} />
                </Grid>        
                <Grid>
                <Button variant="contained" color="primary" className={classes.button} type="submit"
                        onClick = {(e)=>this.handleUpdate(e)}>
                  Update
                </Button>
            </Grid>
            </form>
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

Account.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Account);
