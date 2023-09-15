import {
  Action,
  WalletSelector,
  WalletSelectorState,
} from "@near-wallet-selector/core";
import { BrowserWalletSignAndSendTransactionParams } from "@near-wallet-selector/core/lib/wallet";
import { JsonRpcProvider } from "near-api-js/lib/providers";
import { ENV, getEnv } from "../config";
//import { TGas } from "../../util/conversions";
//import { BatchTransaction } from "../batch-transaction";
//import { U128String } from "../util";
import { WalletInterface } from "./wallet-interface";

export const DEFAULT_GAS = "40000000000000"; // 40 Tgas

export class SelectorWallet implements WalletInterface {
  walletSelector: WalletSelector;
  walletState: WalletSelectorState;

  constructor(walletSelector: WalletSelector) {
    this.walletSelector = walletSelector;
    this.walletState = this.walletSelector.store.getState();
  }

  getAccountId(): string {
    if (!this.isConnected()) throw new Error("Not connected");
    return this.walletState.accounts.find((account: any) => account.active)
      ?.accountId!;
  }

  getDisplayableAccountId(screenWidth: number): string {
    const { startLength, endLength, maxLength } =
      this.getAccountLengths(screenWidth);
    const accountId = this.getAccountId();
    return accountId.length > maxLength
      ? accountId.slice(0, startLength) +
          ".." +
          (endLength === 0 ? "" : accountId.slice(0 - endLength))
      : accountId;
  }

  private getAccountLengths(screenWidth: number): {
    startLength: number;
    endLength: number;
    maxLength: number;
  } {
    if (screenWidth < 480) {
      return { startLength: 7, endLength: 0, maxLength: 8 };
    } else if (screenWidth < 768) {
      return { startLength: 8, endLength: 8, maxLength: 18 };
    } else {
      return { startLength: 10, endLength: 10, maxLength: 22 };
    }
  }

  async getAccountBalance(accountId?: string | undefined): Promise<string> {
    if (!accountId) {
      accountId = this.walletState.accounts.find(
        (account: any) => account.active
      )?.accountId!;
    }
    const body = `
            {
                "jsonrpc": "2.0",
                "id": "dontcare",
                "method": "query",
                "params": {
                    "request_type": "view_account",
                    "finality": "final",
                    "account_id": "${accountId}"
                }
            }`;

    const result = await fetch(getEnv(ENV).nearEnv.nodeUrl, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resultJson = await result.json();
    return resultJson.result ? resultJson.result.amount : resultJson.error.data;
  }

  setNetwork(value: string): void {
    throw Error("can't change networkId");
  }

  getNetwork(): string {
    return this.walletSelector.options.network.networkId;
  }

  isConnected(): boolean {
    return this.walletSelector.isSignedIn();
  }

  async disconnect(): Promise<void> {
    const w = await this.walletSelector.wallet();
    w.signOut();
  }

  checkConnected(): void {
    if (!this.isConnected()) {
      throw Error("Wallet is not connected");
    }
  }

  async view(
    contract: string,
    method: string,
    args: Record<string, any>
  ): Promise<any> {
    try {
      const argsAsString = JSON.stringify(args);
      let argsBase64 = Buffer.from(argsAsString).toString("base64");
      const provider = new JsonRpcProvider(getEnv(ENV).nearEnv.nodeUrl);
      const rawResult = await provider.query({
        request_type: "call_function",
        account_id: contract,
        method_name: method,
        args_base64: argsBase64,
        finality: "optimistic",
      });

      // format result
      // @ts-ignore
      const res = JSON.parse(Buffer.from(rawResult.result).toString());
      return res;
    } catch (err) {
      console.error(
        `Error calling function ${method} from contract ${contract} with params ${JSON.stringify(
          args
        )}`,
        err
      );
    }
  }

  async call(
    contract: string,
    method: string,
    args: Record<string, any>,
    gas?: string | undefined,
    attachedYoctos?: string | undefined
  ): Promise<any> {
    console.log(`Calling ${contract}'s method ${method}`);
    const accountId = this.getAccountId();
    const wallet = await this.walletSelector.wallet();
    const action: Action[] = [
      {
        type: "FunctionCall",
        params: {
          methodName: method,
          args: args,
          gas: gas ?? "40000000000000", ////Gas.parse("40 Tgas"),
          deposit: attachedYoctos ?? "1",
        },
      },
    ];

    const params: BrowserWalletSignAndSendTransactionParams = {
      signerId: accountId!,
      receiverId: contract,
      actions: action,
    };
    const tx = wallet.signAndSendTransaction(params);
    const finalExecOut = await tx;
    console.log("FinalExecOut", finalExecOut);
    return tx;
  }
  /*
  apply(bt: BatchTransaction): Promise<any> {
    throw Error("Not implemented");
  }
*/
  async queryChain(method: string, args: object): Promise<any> {
    const provider = new JsonRpcProvider(getEnv(ENV).nearEnv.nodeUrl);
    return provider.sendJsonRpc(method, args);
  }
}
