import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomiclabs/hardhat-etherscan";

import './tasks/create-pool.ts'
import './tasks/staking-tasks.ts'


const config: HardhatUserConfig = {
  solidity: {compilers: [{version: "0.8.15"},{version: "0.6.6"}]},

  networks: {
    rinkeby: {
      url: process.env.STAGING_ALCHEMY_KEY || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    coinmarketcap: process.env.COINMARKET_CAP_KEY,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;