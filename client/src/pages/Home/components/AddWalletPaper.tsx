import { Theme, createStyles, Typography, withStyles, Paper, WithStyles } from "@material-ui/core";
import { WalletInterface } from "../../../App";
import * as PropTypes from 'prop-types';

const paperStyles = (theme:Theme) => {
  return createStyles({
    root: {
      height: "100%",
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
      },
      paddingTop: theme.spacing() * 2,
      paddingBottom: theme.spacing() * 2,
    },
  })
};
interface Props extends WithStyles<typeof paperStyles> {
  wallets: WalletInterface[]
}

export default withStyles(paperStyles)(({classes, wallets}: Props) => {
  return (
    <div>
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h5" component="h3">
          This is a sheet of paper.
        </Typography>
        <Typography component="p">
          Paper can be used to build surface or other elements for your application.
        </Typography>
      </Paper>
    </div>
  );
});
