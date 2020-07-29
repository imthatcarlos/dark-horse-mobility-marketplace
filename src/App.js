import React, { useState, useEffect } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { SpaceClient } from '@fleekhq/space-client';

import logo from './logo.svg';
import './App.css';
import Dashboard from './pages/Dashboard';
import { getWeb3 } from './utils/getWeb3';
import { getContracts } from './utils/getContracts';
import MobilityAdsClient from './utils/MobilityAdsClient_advertiser';

function App(props) {
  const [web3, setWeb3] = useState(null);
  const [mAdsClient, setMAdsClient] = useState(null);
  // default port exposed by the daemon for client connection is 9998
  const spaceClient = new SpaceClient({
    url: `http://0.0.0.0:9998`,
  });

  const theme = React.useMemo(
    () => createMuiTheme({
      palette: {
        type: 'dark',
      }
    })
  );

  useEffect(() => {
    if (web3 === null) {
      const fetchWeb3 = async () => {
        const web3 = await getWeb3();
        const contracts = await getContracts(web3);

        setMAdsClient(new MobilityAdsClient({
          web3,
          account: web3.coinbase,
          contract: contracts.mobilityCampaigns
        }));

        setWeb3({
          ...web3,
          ...contracts
        });
      };

      fetchWeb3();
    }
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Dashboard
          web3={web3}
          spaceClient={spaceClient}
          mAdsClient={mAdsClient}
        />
      </ThemeProvider>
    </div>
  );
}

export default App;
