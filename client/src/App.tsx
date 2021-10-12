import { CssBaseline, MuiThemeProvider } from '@material-ui/core';
import React from 'react';
import './App.css';
import { Home } from './pages/Home/Home';
import HeaderBar from './modules/components/TopHeadBar';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import theme from './modules/theme';
import { Wallet } from './pages/Wallet/Wallet';
import { useState } from 'react';

export interface WalletInterface {
  walletName: string;
  mnemonic: string;
  seed: string;
}

export const WalletsContext = React.createContext<{wallets: WalletInterface[], setWallets: React.Dispatch<React.SetStateAction<WalletInterface[]>>}>({wallets:[], setWallets: (value) => null});

function App() {
  let [wallets, setWallets] = useState<WalletInterface[]>([]);
  return (
    <div className="App">
      <MuiThemeProvider theme={theme}>
        <CssBaseline/>
        <HeaderBar/>
        <div className="main-content">
          <WalletsContext.Provider value={{wallets, setWallets}}>
            <Router>
              <Switch>
                <Route path="/wallet">
                  <Wallet />
                </Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </Router>
          </WalletsContext.Provider>
        </div>
      </MuiThemeProvider>
    </div>
  );
}

export default App;
