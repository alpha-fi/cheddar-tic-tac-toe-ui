import { useQuery } from "react-query";
import { RefreshIntervalMilliseconds } from "../components/lib/constants";
import {
  useWalletSelector,
  WalletSelectorContextValue,
} from "../contexts/WalletSelectorContext";
import { GameConfigView } from "./useContractParams";

export const getAvailableGames = async (
  walletSelector: WalletSelectorContextValue
): Promise<[string, GameConfigView][] | undefined> => {
  const resp = await walletSelector.tictactoeContract?.get_available_players();
  return resp;
};

export const useAvailablePlayers = () => {
  const walletSelector = useWalletSelector();
  return useQuery<[string, GameConfigView][] | undefined>(
    ["availablePlayers"],
    () => getAvailableGames(walletSelector),
    {
      refetchIntervalInBackground: true,
      refetchInterval: RefreshIntervalMilliseconds,
      cacheTime: 0,
      notifyOnChangePropsExclusions: ["isStale", "isRefetching", "isFetching"],
    }
  );
};
