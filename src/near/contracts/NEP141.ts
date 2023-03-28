import { Action } from "@near-wallet-selector/core";
import { utils } from "near-api-js";
import { SelectorWallet } from "../wallet/wallet-selector";

export interface StorageBalance {
  total: string;
  available: string;
}

export interface FtMetadata {
  spec: string;
  name: string;
  symbol: string;
  icon: string;
  reference: string | null;
  reference_hash: string | null;
  decimals: number;
}

const DEFAULT_GAS = "40000000000000"; // 40 Tgas

export class NEP141 {
  constructor(public wallet: SelectorWallet, public contractId: string) {}

  ft_balance_of(): Promise<string> {
    return this.wallet.view(this.contractId, "ft_balance_of", {
      account_id: this.wallet.getAccountId(),
    });
  }

  ft_metadata(): Promise<FtMetadata> {
    return this.wallet.view(this.contractId, "ft_metadata", {});
  }

  ft_transfer_call(
    receiver_id: string,
    amount: string,
    msg?: string
  ): Promise<string> {
    return this.wallet.call(this.contractId, "ft_transfer_call", {
      receiver_id,
      amount,
      msg: msg || "",
    });
  }

  storage_balance_of(): Promise<StorageBalance | null> {
    return this.wallet.view(this.contractId, "storage_balance_of", {
      account_id: this.wallet.getAccountId(),
    });
  }

  storage_deposit(deposit: string): Promise<string> {
    return this.wallet.call(
      this.contractId,
      "storage_deposit",
      {},
      undefined,
      deposit
    );
  }

  getStorageDepositAction(deposit: number): Action {
    return {
      type: "FunctionCall",
      params: {
        methodName: "storage_deposit",
        args: {},
        gas: DEFAULT_GAS,
        deposit: utils.format.parseNearAmount(deposit.toString())!,
      },
    };
  }

  getFtTransferCallAction(
    receiver_id: string,
    amount: number | string,
    msg?: string
  ): Action {
    return {
      type: "FunctionCall",
      params: {
        methodName: "ft_transfer_call",
        args: {
          receiver_id,
          amount:
            typeof amount === "string"
              ? amount
              : utils.format.parseNearAmount(amount.toString()),
          msg,
        },
        gas: DEFAULT_GAS,
        deposit: "1",
      },
    };
  }
}
