import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Header from './Header';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing.unit,
    paddingTop: theme.spacing.unit*10,
  },
  caption: {
    textAlign: "center",
    width: "100%",
  },
});

const About = props => {
  const { classes, user } = props;
  return (
    <React.Fragment>
      <Header user={user} login="/Login/target/about" />
      <Grid container justify="center" alignItems="center" direction="row" className={classes.root}>
          <Grid className={classes.caption}>
          <Typography component="h2" variant="h5" gutterBottom>
            Stay Hungry, Stay Foolish. 
          </Typography>
          </Grid>
      </Grid>
    </React.Fragment>
  );
}

About.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(About);
