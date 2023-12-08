import { useQuery } from "react-query";
import { RefreshBalancesIntervalMilliseconds } from "../components/lib/constants";
import {
  useWalletSelector,
  WalletSelectorContextValue,
} from "../contexts/WalletSelectorContext";

export const getIsUserRegistered = async (
  walletSelector: WalletSelectorContextValue,
) => {
  if(walletSelector.accountId && walletSelector.tictactoeContract){
    const isRegistered = walletSelector.tictactoeContract.is_user_registered(walletSelector.accountId)
    return isRegistered
  }
  return false
};

export const useGetIsUserRegistered = () => {
  const walletSelector = useWalletSelector();
  return useQuery<boolean>(
    ["isUserRegistered",walletSelector.accountId],
    () => getIsUserRegistered(walletSelector),
    {
      refetchIntervalInBackground: true,
      refetchInterval: RefreshBalancesIntervalMilliseconds,
      cacheTime: 0,
      notifyOnChangePropsExclusions: ["isStale", "isRefetching", "isFetching"],
    }
  );
};
