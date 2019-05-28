import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Header from './Header';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';


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
    const { user } = this.props;

    if (user && this.state.name===undefined) {
      this.handleChange("");
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
    const data = doc.data();
    if (data && data.uid !== user.uid) {
      this.setState({label:"Not available", indicator:{error:true}});
      return;
    }
    this.setState({label:"Available", indicator:{}});
  }

  async handleUpdate() {
    console.log("handleUpdate");
    //var headers = new Headers();
    //headers.append('pragma', 'no-cache');
    //headers.append('cache-control', 'no-cache');
    
    var options = {
      method: 'PUT',
    };
    const res = await fetch("https://skelton-us.firebaseapp.com/api/username?name=foo&uid=bar", options);
    const json = await res.json();
    console.log("res.json()=", json);
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
            <Grid item className={classes.caption}>
              <Typography component="h2" variant="h5" gutterBottom>
                Account Page. 
              </Typography>
              <TextField {...this.state.indicator} label={this.state.label} value={this.state.name || ""}
                      className={classes.textField} margin="normal" 
                      onChange = {(e)=>this.handleChange(e.target.value)} />
              </Grid>        
              <Grid>
              <Button variant="contained" color="primary" className={classes.button}
                      onClick = {(e)=>this.handleUpdate(e)}>
                Update
              </Button>
            </Grid>
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
