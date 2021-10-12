
import {AppBar, Toolbar, Typography} from '@material-ui/core';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
});

function HeadAppBar(props: any) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" color="inherit" noWrap>
            Bitcoin-Playground
          </Typography>
          <div className={classes.grow} />
        </Toolbar>
      </AppBar>
    </div>
  );
}

HeadAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HeadAppBar);