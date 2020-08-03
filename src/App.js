import React, { useState, useEffect } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
// import { SpaceClient } from '@fleekhq/space-client';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

import logo from './logo.svg';
import './App.css';
import Dashboard from './pages/Dashboard';
import { getWeb3 } from './utils/getWeb3';
import { getContracts } from './utils/getContracts';
import MobilityAdsClient from './utils/MobilityAdsClient_advertiser';
import ThreadService from './utils/threadService';

function App(props) {
  const [web3, setWeb3] = useState(null);
  const [mAdsClient, setMAdsClient] = useState(null);
  const [threadInstance, setThreadInstance] = useState(null);
  // // default port exposed by the daemon for client connection is 9998
  // const spaceClient = new SpaceClient({
  //   url: `http://0.0.0.0:9998`,
  // });

  const apolloClient = new ApolloClient({ uri: process.env.REACT_APP_GRAPH_URL });

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

        // init thread client
        const threadService = new ThreadService();
        await threadService.init();
        await threadService.start(web3.coinbase);

        setThreadInstance(threadService);

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
        <ApolloProvider client={apolloClient}>
          <Dashboard
            web3={web3}
            spaceClient={null}
            mAdsClient={mAdsClient}
            threadInstance={threadInstance}
          />
        </ApolloProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
