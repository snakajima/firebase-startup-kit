import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Header from './Header';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Redirect } from 'react-router-dom';

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
  state = { name: undefined, label: "" };

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
    const { db } = this.props;
    this.setState({name:name});
    if (name.length === 0) {
      this.setState({label:"user name"})
      return;
    }
    if (name.length < 4) {
      this.setState({label:"Minimum 4 characters"})
      return;
    }
    const ref = db.collection("usernames").doc(name);
    const doc = await ref.get();
    const data = doc.data();
    if (data) {
      this.setState({label:"Not available"})
      return;
    }
    this.setState({label:"Available"})
  }

  render() {
    const { classes, user } = this.props;
    if (!user) {
      return <Redirect to={"/login"} />
    }
    return (
      <React.Fragment>
        <Header user={user} login="/Login/target/about" />
        <Grid container justify="center" alignItems="center" direction="row" className={classes.root}>
            <Grid className={classes.caption}>
            <Typography component="h2" variant="h5" gutterBottom>
              Account Page. 
            </Typography>
            <TextField label={this.state.label} value={this.state.name || ""}
                    className={classes.textField} margin="normal" 
                    onChange = {(e)=>this.handleChange(e.target.value)} />
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
