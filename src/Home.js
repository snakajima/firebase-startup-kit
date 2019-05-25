import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Header from './Header';
import { Typography } from '@material-ui/core';

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

function ComplexGrid(props) {
  const { classes, user } = props;
  return (
    <React.Fragment>
      <Header user={user} />
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

ComplexGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComplexGrid);
