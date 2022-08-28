import { Grid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { useContractParams } from "../../../hooks/useContractParams";
import useScreenSize from "../../../hooks/useScreenSize";
import Board from "../components/Board";
import Info from "../components/Info";

export type GameParamsState = {
  gameId: string | null;
  iniinitiatedAt: number | null;
  opponentId: string | null;
  rewardTokenId: string | null;
  tiles: ("O" | "X" | null)[][];
  winnerId: string | null;
  winnerReward: string | null;
  winningAction: string | null;
};

export const initialActiveGameParamsState = {
  gameId: null,
  iniinitiatedAt: null,
  opponentId: null,
  rewardTokenId: null,
  tiles: [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
  winnerId: null,
  winnerReward: null,
  winningAction: null,
};

export function TicTacToe() {
  const [activeGameParams, setActiveGameParams] = useState<GameParamsState>(
    initialActiveGameParamsState
  );
  const walletSelector = useWalletSelector();
  const { data } = useContractParams();

  const { height, width } = useScreenSize();
  const isLandscape = width > height * 1.5;

  useEffect(() => {
    if (data?.active_game && !activeGameParams.gameId) {
      setActiveGameParams({
        ...initialActiveGameParamsState,
        gameId: data.active_game[0],
        opponentId:
          data.active_game[1].player1 === walletSelector.accountId
            ? data.active_game[1].player2
            : data.active_game[1].player1,
        iniinitiatedAt: data.active_game[1].initiated_at_sec,
        rewardTokenId: data.active_game[1].reward.token_id,
      });
    }
  }, [activeGameParams.gameId, data?.active_game, walletSelector.accountId]);

  return (
    <Grid
      templateColumns={{
        base: "1fr",
        sm: isLandscape ? "1fr 1fr" : "1fr",
        md: "1fr 1fr",
      }}
      gap={4}
    >
      <Info
        data={data}
        activeGameParams={activeGameParams}
        setActiveGameParams={setActiveGameParams}
      />
      <Board
        isLandscape={isLandscape}
        activeGameParams={activeGameParams}
        setActiveGameParams={setActiveGameParams}
      />
    </Grid>
  );
}
