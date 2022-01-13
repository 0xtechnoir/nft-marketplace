require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
const infura_url = process.env.INFURA_URL;
const private_key = process.env.PRIVATE_KEY;

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${infura_url}`,
      accounts: [private_key]
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${infura_url}`},
    accounts: [private_key]
  },
  solidity: "0.8.4",
};
