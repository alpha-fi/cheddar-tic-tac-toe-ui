import { useQuery } from "react-query";
import {
  useWalletSelector,
  WalletSelectorContextValue,
} from "../contexts/WalletSelectorContext";
import { NEP141 } from "../near/contracts/NEP141";
import { SelectorWallet } from "../near/wallet/wallet-selector";

export interface WhiteListedTokens {
  name: string;
  contractId: string;
  value: string;
  minDeposit: string;
}

const getWhiteListedTokens = async (
  walletSelector: WalletSelectorContextValue
) => {
  const whiteListedTokens: WhiteListedTokens[] = [
    {
      name: "NEAR",
      contractId: "",
      value: "1000000000000000000000000",
      minDeposit: "10000000000000000000000",
    },
  ];
  const resp = await walletSelector.ticTacToeLogic?.getWhiteListedTokens();
  if (!resp) {
    return whiteListedTokens;
  }
  const selectorWallet = new SelectorWallet(walletSelector.selector);
  for (const item of resp) {
    const minDeposit = await walletSelector.ticTacToeLogic?.getTokenMinDeposit(
      item[0]
    );
    const metadata = await new NEP141(selectorWallet, item[0]).ft_metadata();
    whiteListedTokens.push({
      name: metadata.name.toUpperCase(),
      contractId: item[0],
      value: item[1],
      minDeposit: minDeposit || "1",
    });
  }

  return whiteListedTokens;
};

export const useWhiteListedTokens = () => {
  const walletSelector = useWalletSelector();
  return useQuery<WhiteListedTokens[]>(
    ["WhiteListedTokens"],
    () => getWhiteListedTokens(walletSelector),
    {
      refetchInterval: Infinity,
      cacheTime: 0,
      notifyOnChangePropsExclusions: ["isStale", "isRefetching", "isFetching"],
    }
  );
};
