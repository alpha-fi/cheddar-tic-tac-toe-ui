import React, { useCallback, useContext, useEffect, useState } from "react";
import { map, distinctUntilChanged } from "rxjs";
import {
  NetworkId,
  setupWalletSelector,
  Wallet,
} from "@near-wallet-selector/core";
import type { WalletSelector, AccountState } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import type { WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { contractName, nearConfig } from "../near";
import { setupNearWalletCustom } from "../near/wallet/selector-utils";
import "./WalletSelectorContext.css";
import { NEP141 } from "../near/contracts/NEP141";
import { TicTacToeContract } from "../near/contracts/TicTacToe";
import { SelectorWallet } from "../near/wallet/wallet-selector";
import { ENV, getEnv } from "../near/config";
import { TicTacToeLogic } from "../near/logics/TicTacToeLogic";

declare global {
  interface Window {
    selector: WalletSelector;
    modal: WalletSelectorModal;
  }
}

interface WalletSelectorContextValue {
  selector: WalletSelector;
  modal: WalletSelectorModal;
  accounts: Array<AccountState>;
  accountId: string | null;
  wallet: Wallet | null;
  cheddarContract: NEP141 | null;
  tictactoeContract: TicTacToeContract | null;
  ticTacToeLogic: TicTacToeLogic | null;
}

const WalletSelectorContext =
  React.createContext<WalletSelectorContextValue | null>(null);

type Props = {
  children: React.ReactNode;
};

export const WalletSelectorContextProvider = ({ children }: Props) => {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accounts, setAccounts] = useState<Array<AccountState>>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [cheddarContract, setCheddarContract] = useState<NEP141 | null>(null);
  const [tictactoeContract, setTictactoeContract] =
    useState<TicTacToeContract | null>(null);
  const [ticTacToeLogic, setTicTacToeLogic] = useState<TicTacToeLogic | null>(null);

  const init = useCallback(async () => {
    const _selector = await setupWalletSelector({
      network: nearConfig.networkId as NetworkId,
      debug: true,
      modules: [setupNearWallet(), setupSender(), setupNearWalletCustom()],
    });
    const _modal = setupModal(_selector, { contractId: contractName });
    const state = _selector.store.getState();

    setAccounts(state.accounts);

    window.selector = _selector;
    window.modal = _modal;
    setSelector(_selector);
    setModal(_modal);
  }, []);

  useEffect(() => {
    init().catch((err) => {
      console.error(err);
      alert("Failed to initialise wallet selector");
    });
  }, [init]);

  useEffect(() => {
    if (!selector) {
      return;
    }
    if (selector.isSignedIn()) {
      selector.wallet().then((wallet) => setWallet(wallet));
    }

    const selectorWallet = new SelectorWallet(selector);
    const tttContract = new TicTacToeContract(selectorWallet)
    setTictactoeContract(tttContract);
    const cheddarContractId = getEnv(ENV).cheddarContractId;
    const cContract = new NEP141(selectorWallet, cheddarContractId)
    setCheddarContract(cContract);

    const a = new TicTacToeLogic(tttContract, cContract)
    setTicTacToeLogic(new TicTacToeLogic(tttContract, cContract))

    // a.bet(1, true)

    const subscription = selector.store.observable
      .pipe(
        map((state) => state.accounts),
        distinctUntilChanged()
      )
      .subscribe((nextAccounts) => {
        console.log("Accounts Update", nextAccounts);

        setAccounts(nextAccounts);
      });

    return () => subscription.unsubscribe();
  }, [selector]);

  if (!selector || !modal) {
    return null;
  }

  const accountId =
    accounts.find((account) => account.active)?.accountId || null;

  return (
    <WalletSelectorContext.Provider
      value={{
        selector,
        modal,
        accounts,
        accountId,
        wallet,
        cheddarContract,
        tictactoeContract,
        ticTacToeLogic
      }}
    >
      {children}
    </WalletSelectorContext.Provider>
  );
};

export function useWalletSelector() {
  const context = useContext(WalletSelectorContext);

  if (!context) {
    throw new Error(
      "useWalletSelector must be used within a WalletSelectorContextProvider"
    );
  }

  return context;
}
