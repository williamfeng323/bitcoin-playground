import { Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import {CreateWallet} from "./pages/CreateWallet/CreateWallet";

const useStyle = makeStyles({
    wallet: {
        height: '100%'
    }
})

const Wallet = () => {
    const classes = useStyle()
    let { path } = useRouteMatch();
    return (
    <div className={classes.wallet}>
        <Switch>
            <Route exact path={path}>
                <Typography  variant="h6" color="inherit" noWrap>
                    Wallet-Playground
                </Typography>
            </Route>
            <Route path={`${path}/create-wallet`}>
                <CreateWallet />
            </Route>
        </Switch>
    </div>
  )
};

export { Wallet };
