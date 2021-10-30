import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { useContext } from 'react';
import { WalletsContext } from '../../App';
import { ManageAddress } from '../Wallet/pages/ManageAddress/ManageAddress';
import AddWalletPaper from './components/AddWalletPaper';

const homeStyle = makeStyles({
  home: {
    height: '100vh',
    width: '100%',
  },
  addWalletPaper: {
      width: '50%',
      top: '40%',
      margin: 'auto',
      position: 'relative',
  }
});

const Home = () => {
  let {wallets} = useContext(WalletsContext);
  const classes = homeStyle();
  return (
    <div className={classes.home}>
      {
        wallets.length > 0 ?
          <div>
            <ManageAddress wallets={wallets}/>
          </div>:
          <div className={classes.addWalletPaper}>
            <Container>
              <AddWalletPaper wallets={wallets}/>
            </Container>
          </div>
      }
    </div>
  )
};

export { Home };
