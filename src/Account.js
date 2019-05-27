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

const Account = props => {
  const { classes, user } = props;
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
          <TextField label={"unique name"} value={user.displayName}
                  className={classes.textField} margin="normal" 
                  onChange = {(e)=>this.handleChange(e)} />
          </Grid>
      </Grid>
    </React.Fragment>
  );
}

Account.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Account);
