import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config = {
  solidity: "0.8.20",
  networks: {
    shardeum: {
      url: process.env.NEXT_PUBLIC_SHARDEUM_RPC_URL,
      chainId: parseInt(process.env.NEXT_PUBLIC_SHARDEUM_CHAIN_ID),
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
  },
};

export default config;
