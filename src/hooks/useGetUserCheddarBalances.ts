import { useQuery } from "react-query";
import { RefreshBalancesIntervalMilliseconds } from "../components/lib/constants";
import {
  useWalletSelector,
  WalletSelectorContextValue,
} from "../contexts/WalletSelectorContext";
import { useGetIsUserRegistered } from "./useGetIsUserRegistered";

export const getCheddarBalances = async (
  walletSelector: WalletSelectorContextValue,
  isUserRegisteredData: boolean
) => {
  const balances = await Promise.all([
    isUserRegisteredData? walletSelector.tictactoeContract?.get_cheddar_balance():0,
    walletSelector.cheddarContract?.ft_balance_of()
  ])
  return {
    gameBalance: balances[0] || 0,
    walletBalance: balances[1] || "0"
  }
};

export const useGetUserCheddarBalances = () => {
  const walletSelector = useWalletSelector();
  const { data: isUserRegisteredData = false } = useGetIsUserRegistered()
  return useQuery<{gameBalance:number,walletBalance:string}>(
    ["cheddarBalances",walletSelector.accountId,isUserRegisteredData],
    () => getCheddarBalances(walletSelector,isUserRegisteredData),
    {
      refetchIntervalInBackground: true,
      refetchInterval: RefreshBalancesIntervalMilliseconds,
      cacheTime: 0,
      notifyOnChangePropsExclusions: ["isStale", "isRefetching", "isFetching"],
    }
  );
};
