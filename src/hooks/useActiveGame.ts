import { useQuery } from "react-query";
import { RefreshIntervalMilliseconds } from "../components/lib/constants";
import { GameParamsState } from "../components/TicTacToe";
import {
  useWalletSelector,
  WalletSelectorContextValue,
} from "../contexts/WalletSelectorContext";
import { isNumberValid } from "../shared/helpers/common";
import { GameId } from "./useContractParams";

export const getCurrentActiveGames = async (
  walletSelector: WalletSelectorContextValue
): Promise<[GameId, GameParamsState] | undefined> => {
  const resp = await walletSelector.tictactoeContract?.get_active_games();
  const currentActiveGame = resp?.filter(
    (game) =>
      game[1].player1 === walletSelector.accountId ||
      game[1].player2 === walletSelector.accountId
  )[0];
  if (typeof currentActiveGame?.[0] === "string") {
    currentActiveGame[0] = parseInt(currentActiveGame[0]);
  }
  return currentActiveGame;
};

// run the query only if no active game is found
export const useCurrentUserActiveGame = (activeGameID: any) => {
  const walletSelector = useWalletSelector();
  return useQuery<[GameId, GameParamsState] | undefined>(
    ["currentActiveGame"],
    () =>
      isNumberValid(activeGameID)
        ? undefined
        : getCurrentActiveGames(walletSelector),
    {
      refetchIntervalInBackground: true,
      refetchInterval: RefreshIntervalMilliseconds,
      cacheTime: 0,
      notifyOnChangePropsExclusions: ["isStale", "isRefetching", "isFetching"],
    }
  );
};
