require('dotenv').config();
const Web3 = require('web3');
var HDWalletProvider = require("truffle-hdwallet-provider");
const transmuteConfig = require('./src/transmute-config');

module.exports = {
  migrations_directory: './migrations',
  networks: {
    development: {
      provider: new Web3.providers.HttpProvider(
        transmuteConfig.web3Config.providerUrl
      ),
      network_id: '*' // Match any network id
    },
    // Providers using HDWallet need to be wrapped in a function: https://truffleframework.com/docs/advanced/configuration#providers
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(process.env.TESTNET_MNEMONIC, `https://rinkeby.infura.io/${process.env.INFURA_API_TOKEN}`);
      },
      network_id: 4
    }
  }
};
