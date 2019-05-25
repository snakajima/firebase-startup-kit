import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Header from './Header';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 10,
    },
});
const Processing = props => {
    const {classes} = props;
    return <React.Fragment>
      <Header user={props.user} />
      <Grid container justify="center">
        <Grid item className={classes.root}>
          <CircularProgress />
        </Grid>
      </Grid>
    </React.Fragment>
};

Processing.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(Processing);