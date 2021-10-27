import {Theme, createStyles, Typography, withStyles, Paper, WithStyles, Button} from "@material-ui/core";
import { WalletInterface } from "../../../App";
import { useHistory } from "react-router-dom";
import * as H from 'history';

const paperStyles = (theme:Theme) => {
  return createStyles({
    root: {
      height: "100%",
      margin: "auto",
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
      },
      paddingTop: theme.spacing() * 2,
      paddingBottom: theme.spacing() * 2,
    },
    "guide-create-text": {
      marginTop: "20px"
    }
  })
};
interface Props extends WithStyles<typeof paperStyles> {
  wallets: WalletInterface[]
}

const clickToCreate = ( history: H.History) => {
  history.push("/wallet/create-wallet")
}

export default withStyles(paperStyles)(({classes, wallets}: Props) => {
  let history = useHistory();
  return (
    <div>
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h5" component="h3">
          You don't have any wallet yet
        </Typography>
        <Typography component="p" className="guide-create-text">
          Press <Button variant="contained" color="primary" onClick={() => {clickToCreate(history)}}> Create Wallet</Button> to create your first wallet!
        </Typography>
      </Paper>
    </div>
  );
});
