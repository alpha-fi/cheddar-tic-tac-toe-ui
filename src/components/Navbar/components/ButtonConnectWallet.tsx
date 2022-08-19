import { Button } from "@chakra-ui/react";
import React from "react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";

export function ButtonConnectWallet() {
  const walletSelector = useWalletSelector();

  const handleOnClick = async () => {
    if (walletSelector.selector.isSignedIn() && walletSelector.wallet) {
      walletSelector.wallet.signOut();
    } else {
      walletSelector.modal.show();
    }
  };
  return (
    <>
      {walletSelector.selector.isSignedIn() ? (
        <Button onClick={handleOnClick}>disconnect</Button>
      ) : (
        <Button onClick={handleOnClick}>connect</Button>
      )}
    </>
  );
}
