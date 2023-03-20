import { useQuery } from "react-query";
import { RefreshIntervalMilliseconds } from "../components/lib/constants";
import { GameParamsState } from "../components/TicTacToe";
import {
  useWalletSelector,
  WalletSelectorContextValue,
} from "../contexts/WalletSelectorContext";
import { GameId } from "./useContractParams";

export const getActiveGames = async (
  walletSelector: WalletSelectorContextValue
): Promise<[GameId, GameParamsState][] | undefined> => {
  const resp = await walletSelector.tictactoeContract?.get_active_games();
  return resp;
};

export const useActiveGames = () => {
  const walletSelector = useWalletSelector();
  return useQuery<[GameId, GameParamsState][] | undefined>(
    ["activeGames"],
    () => getActiveGames(walletSelector),
    {
      refetchIntervalInBackground: true,
      refetchInterval: RefreshIntervalMilliseconds,
      cacheTime: 0,
      notifyOnChangePropsExclusions: ["isStale", "isRefetching", "isFetching"],
    }
  );
};
