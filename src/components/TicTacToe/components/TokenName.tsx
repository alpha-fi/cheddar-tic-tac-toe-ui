import React, { useEffect, useState } from "react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { NEP141 } from "../../../near/contracts/NEP141";
import { SelectorWallet } from "../../../near/wallet/wallet-selector";

type Props = {
  tokenId: string;
};

export default function TokenName({ tokenId }: Props) {
  const [tokenName, setTokenName] = useState("");
  const walletSelector = useWalletSelector();

  useEffect(() => {
    if (tokenId === "near") {
      setTokenName("Near");
    } else {
      // we currently support only Cheddar
      setTokenName("Cheddar");
      // const selectorWallet = new SelectorWallet(walletSelector.selector);
      // new NEP141(selectorWallet, tokenId)
      //   .ft_metadata()
      //   .then((resp) => setTokenName(resp.name));
    }
  }, [tokenId, walletSelector.selector]);
  return <span>{tokenName}</span>;
}
