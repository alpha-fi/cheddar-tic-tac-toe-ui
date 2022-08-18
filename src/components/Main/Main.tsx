import { Button, Text } from "@chakra-ui/react";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import React, { useEffect } from "react";
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import { contractName } from "../../near";
import { setupSelector } from "../../near/wallet/selector-utils";
import { SelectorWallet } from "../../near/wallet/wallet-selector";

export default function Main() {
  const walletSelector = useWalletSelector();

  const handleOnClick = async () => {
    if (walletSelector.selector.isSignedIn() && walletSelector.wallet) {
      walletSelector.wallet.signOut();
    } else {
      walletSelector.modal.show();
    }
  };

  const handleOnClick2 = async () => {
    console.log(
      await new SelectorWallet(walletSelector.selector).view(
        "token-v3.cheddar.testnet",
        "ft_balance_of",
        { account_id: "oreos.testnet" }
      )
    );

    /*await new SelectorWallet(walletSelector.selector).call(
      "token-v3.cheddar.testnet",
      "ft_transfer",
      { receiver_id: "silkking.testnet", amount: "3000000000000000000000000" }
    );*/
  };

  return (
    <div>
      <Text fontSize="24px" fontWeight={700}>
        Main
      </Text>
      {walletSelector.selector.isSignedIn() ? (
        <Button onClick={handleOnClick}>disconnect</Button>
      ) : (
        <Button onClick={handleOnClick}>connect</Button>
      )}
      <Button onClick={handleOnClick2}>view</Button>
    </div>
  );
}
