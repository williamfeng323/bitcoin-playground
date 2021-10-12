import { Typography } from '@material-ui/core';
import React from 'react';
import { useContext } from 'react';
import { WalletsContext } from '../../App';
import AddWalletPaper from './components/AddWalletPaper';

import "./Home.css";

const Home = () => {
  let {wallets} = useContext(WalletsContext);
  return (
    <div className="home">
      {
        wallets.length > 0 ?
          <Typography  variant="h6" color="inherit" noWrap>
            Bitcoin-Playground-notnull
          </Typography> :
          <div className="center add-wallet-paper">
            <AddWalletPaper wallets={wallets}/>
          </div>
      }
    </div>
  )
};

export { Home };
