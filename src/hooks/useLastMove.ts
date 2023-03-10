import { useQuery } from "react-query";
import {
  useWalletSelector,
  WalletSelectorContextValue,
} from "../contexts/WalletSelectorContext";
import { isGameIDValid } from "../shared/helpers/common";
import { Coords, GameId, Piece } from "./useContractParams";

export const getLastMove = async (
  walletSelector: WalletSelectorContextValue,
  gameId: GameId
) => {
  const resp = await walletSelector.tictactoeContract?.get_last_move(gameId);
  return resp;
};

export const useLastMove = (gameId: GameId | null) => {
  const walletSelector = useWalletSelector();
  return useQuery<[Coords, Piece] | undefined>(
    ["lastMove"],
    () =>
      isGameIDValid(gameId)
        ? getLastMove(walletSelector, gameId as number)
        : undefined,
    {
      refetchIntervalInBackground: true,
      refetchInterval: 2000,
      cacheTime: 0,
      notifyOnChangePropsExclusions: ["isStale", "isRefetching", "isFetching"],
    }
  );
};
