import Web3 from 'web3';

const NETWORKS = {
  1: "mainnet",
  2: "morden",
  3: "ropsten",
  4: "unknown"
};

export const getWeb3 = () => new Promise((resolve, reject) => {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', async () => {
    var results
    var web3;

    // Modern dapp browsers...
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();

        // Acccounts now exposed
        var accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          web3.eth.net.getId().then((network) => {
            resolve({
              ...web3,
              network: (network > 10 ? 'development' : NETWORKS[network]),
              accounts: accounts,
              coinbase: accounts[0]
            });

          }).catch((error) => {
            reject();
          });
        } else {
          reject();
        }

      } catch (error) {
        // User denied account access...
        reject();
      }
    } else if (window.web3) {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(window.web3.currentProvider);

      // make sure they have MM unlocked
      web3.eth.getAccounts().then((accounts) => {
        if (accounts.length > 0) {
          web3.eth.net.getId().then((network) => {
            resolve({
              ...web3,
              network: (network > 10 ? 'development' : NETWORKS[network]),
              accounts: accounts,
              coinbase: accounts[0]
            });
          }).catch((error) => {
            reject();
          });
        } else {
          reject();
        }
      }).catch((error) => {
        reject();
      });
    } else if (process.env.NODE_ENV === 'development') {
      /* FALLBACK CODE */
      // Fallback to localhost if no web3 injection. We've configured this to
      // use the development console's port by default.
      var provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545')
      web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();

      if (accounts.length > 0) {
        resolve({
          ...web3,
          network: 'development',
          accounts: accounts,
          coinbase: accounts[0]
        });
      } else {
        reject();
      }
   } else {
     reject();
   }
 });
});
