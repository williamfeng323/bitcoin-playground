import { Card, CardContent, CardHeader, Chip, Container, Typography } from '@material-ui/core';
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
            <Card >
              <CardHeader title="Mnemonic Sentence"/>
              <CardContent>
                {wallets.map(wallet => {
                  return React.cloneElement(
                    <Chip label={wallet.walletName}/>
                  )
                })}
              </CardContent>
            </Card>
          </Typography> :
          <div className="center add-wallet-paper">
            <Container>
              <AddWalletPaper wallets={wallets}/>
            </Container>
          </div>
      }
    </div>
  )
};

export { Home };
