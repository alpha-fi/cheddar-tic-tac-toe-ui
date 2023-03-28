import { useQuery } from "react-query";
import { RefreshIntervalMilliseconds } from "../components/lib/constants";
import {
  useWalletSelector,
  WalletSelectorContextValue,
} from "../contexts/WalletSelectorContext";
import { isNumberValid } from "../shared/helpers/common";
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
  return useQuery<[Coords | null, Piece, any, number | null] | undefined>(
    ["lastMove"],
    () =>
      isNumberValid(gameId)
        ? getLastMove(walletSelector, gameId as number)
        : undefined,
    {
      refetchIntervalInBackground: true,
      refetchInterval: RefreshIntervalMilliseconds,
      cacheTime: 0,
      notifyOnChangePropsExclusions: ["isStale", "isRefetching", "isFetching"],
    }
  );
};
