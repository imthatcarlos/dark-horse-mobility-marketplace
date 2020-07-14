import React, { useState, useEffect } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { SpaceClient } from '@fleekhq/space-client';

import logo from './logo.svg';
import './App.css';
import Dashboard from './pages/Dashboard';
import { getWeb3 } from './utils/getWeb3';

function App() {
  const [web3, setWeb3] = useState(null);
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
        setWeb3(await getWeb3());
      };

      fetchWeb3();
    }
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Dashboard web3={web3} spaceClient={spaceClient} />
      </ThemeProvider>
    </div>
  );
}

export default App;
