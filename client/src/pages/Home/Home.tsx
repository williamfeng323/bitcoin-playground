import { Typography } from '@material-ui/core';
import React from 'react';
import { useContext } from 'react';
import { WalletsContext } from '../../App';
import AddWalletPaper from './components/AddWalletPaper'

const Home = () => {
  let {wallets} = useContext(WalletsContext);
  return (
    <div>
      {
        wallets.length > 0 ?
          <Typography  variant="h6" color="inherit" noWrap>
            Bitcoin-Playground-notnull
          </Typography> :
          <AddWalletPaper wallets={wallets}/>
      }

    </div>
  )
};

export { Home };
