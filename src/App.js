import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Dashboard from './pages/Dashboard';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { getWeb3 } from './utils/getWeb3';

function App() {
  const [web3, setWeb3] = useState(null);

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
        <Dashboard web3={web3} />
      </ThemeProvider>
    </div>
  );
}

export default App;
