import { WhiteListedTokens } from "../shared/helpers/getTokens";

const MAINNET = "mainnet";
const TESTNET = "testnet";
const CHEDDAR_CONTRACT_NAME = 'token.cheddar.near'
const TESTNET_CHEDDAR_CONTRACT_NAME = 'token-v3.cheddar.testnet'
const TESTNET_CONTRACT_NAME = "tictactoe.cheddar.testnet"

export const ENV = TESTNET;

interface NearEnv {
  networkId: string;
  nodeUrl: string;
  walletUrl: string;
  helperUrl: string;
  explorerUrl: string;
  headers: Object;
  tokensData: WhiteListedTokens[]
}

interface TicTacToeEnv {
  nearEnv: NearEnv;
  contractId: string;
  cheddarContractId: string;
}

export function getEnv(env: string): TicTacToeEnv {
  switch (env) {
    case MAINNET:
      return {
        nearEnv: {
          networkId: "mainnet",
          nodeUrl: "https://rpc.mainnet.near.org",
          walletUrl: "https://wallet.near.org",
          helperUrl: "https://helper.mainnet.near.org",
          explorerUrl: "https://explorer.mainnet.near.org/",
          headers: {},
          tokensData: [
            {
              "name": "CHEDDAR",
              "contractId": CHEDDAR_CONTRACT_NAME,
              "value": "1000000000000000000000000",
              "minDeposit": "1000000000000000000000000"
            }
          ]
        },
        contractId: "NOT SET YET",
        cheddarContractId: "NOT SET YET",
      };
    case TESTNET:
      return {
        nearEnv: {
          networkId: "testnet",
          nodeUrl: "https://rpc.testnet.near.org",
          walletUrl: "https://wallet.testnet.near.org",
          helperUrl: "https://helper.testnet.near.org",
          explorerUrl: "https://explorer.testnet.near.org/",
          headers: {},
          tokensData: [
            {
              "name": "CHEDDAR",
              "contractId": TESTNET_CHEDDAR_CONTRACT_NAME,
              "value": "1000000000000000000000000",
              "minDeposit": "1000000000000000000000000"
            }
          ]
        },
        contractId: TESTNET_CONTRACT_NAME,
        cheddarContractId: TESTNET_CHEDDAR_CONTRACT_NAME,
      };
    default:
      throw new Error(`${env} is not a valid NEAR environment`);
  }
}
