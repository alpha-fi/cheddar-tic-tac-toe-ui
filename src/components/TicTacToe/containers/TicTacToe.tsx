import { Grid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { useContractParams } from "../../../hooks/useContractParams";
import useScreenSize from "../../../hooks/useScreenSize";
import Board from "../components/Board";
import Info from "../components/Info";

export type GameParamsState = {
  game_id: string | null;
  game_result: { result: string | null; winner_id: string | null };
  player1: string | null;
  player2: string | null;
  current_player: { piece: "O" | "X" | null; account_id: string | null };
  reward_or_tie_refund: {
    token_id: string | null;
    balance: string | null;
  };
  board: ("O" | "X" | null)[][];
};

export const initialActiveGameParamsState2 = {
  game_id: null,
  game_result: { result: null, winner_id: null },
  player1: null,
  player2: null,
  current_player: { piece: null, account_id: null },
  reward_or_tie_refund: {
    token_id: null,
    balance: null,
  },
  board: [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
};

export function TicTacToe() {
  const [activeGameParams, setActiveGameParams] = useState<GameParamsState>(
    initialActiveGameParamsState2
  );
  const walletSelector = useWalletSelector();
  const { data } = useContractParams();

  const { height, width } = useScreenSize();
  const isLandscape = width > height * 1.5;
  console.log(data);
  console.log(data?.active_game);
  console.log(activeGameParams);

  useEffect(() => {
    if (data?.active_game && !activeGameParams.game_id) {
      setActiveGameParams({
        ...initialActiveGameParamsState2,
        game_id: data.active_game[0],
        current_player: data.active_game[1].current_player,
        board: data.active_game[1].tiles,
      });
    }
    console.log("first");
  }, [activeGameParams.game_id, data?.active_game, walletSelector.accountId]);

  useEffect(() => {
    const currentPlayer = data?.active_game?.[1].current_player;
    if (currentPlayer) {
      setActiveGameParams((prev) => {
        return {
          ...prev,
          current_player: currentPlayer,
        };
      });
    }
  }, [data?.active_game]);

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
