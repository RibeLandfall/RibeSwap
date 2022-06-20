require("@nomiclabs/hardhat-waffle");
require('hardhat-contract-sizer');
require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {
      gas: 12000000,
      blockGasLimit: 0x1fffffffffffff,
      //allowUnlimitedContractSize: true,
      timeout: 1800000
    },
    rinkeby: {
      //gas: 12000000,
      //blockGasLimit: 0x1fffffffffffff,
      //allowUnlimitedContractSize: true,
      timeout: 1800000,
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    goerli: {
      //gas: 12000000,
      //blockGasLimit: 0x1fffffffffffff,
      //allowUnlimitedContractSize: true,
      timeout: 1800000,
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.0",
        config: {},
      },
      {
        version: "0.4.18",
        config: {},
      },
      {
        version: "0.6.6",
        config: {},
      },
      {
        version: "0.8.14",
        config: {},
      },
      {
        version: "0.8.15",
        config: {},
      },
      {
        version: "0.7.6",
        config: {},
      },
      {
        version: "0.5.16",
        config: {},
        /*
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
            details: {
              yul: false
            }
          },
          viaIR : true,
        },
        */
      },
    ],
  }
};
