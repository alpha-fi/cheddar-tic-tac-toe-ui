import * as naj from "near-api-js";

import { Buffer } from "buffer";
import { ENV, getEnv } from "./config";
if (typeof window !== "undefined") window.Buffer = Buffer;
if (typeof global !== "undefined") global.Buffer = Buffer;

export const contractName = "tictactoe.cheddar.testnet";

export const nearConfig = /near$/.test(contractName)
  ? {
      networkId: "mainnet",
      nodeUrl: "https://rpc.mainnet.near.org",
      walletUrl: "https://wallet.near.org",
      helperUrl: "https://helper.mainnet.near.org",
      headers: {},
    }
  : // /testnet$/.test(contractName)?
    {
      networkId: "testnet",
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      headers: {},
    };
//: undefined;

/*
if (!nearConfig) {
  throw new Error(
    `Don't know what network settings to use for contract "${contractName}"; expected name to end in 'testnet' or 'near'`
  );
}
*/
/**
 * NEAR Config object
 */
export const near = new naj.Near({
  ...nearConfig,
  keyStore:
    typeof window === "undefined"
      ? new naj.keyStores.InMemoryKeyStore()
      : new naj.keyStores.BrowserLocalStorageKeyStore(),
});

/**
 * Interface to NEAR Wallet
 export const wallet = new naj.WalletConnection(near);
 */

/*
export function signIn() {
  wallet.requestSignIn({ contractId: contractName });
}
*/
