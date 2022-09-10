import { Grid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { useContractParams } from "../../../hooks/useContractParams";
import useScreenSize from "../../../hooks/useScreenSize";
import { useWhiteListedTokens } from "../../../hooks/useWhiteListedTokens";
import {
  addNotification,
  askUserPermission,
  hasUserPermission,
  isNotificationSupported,
} from "../../../shared/helpers/notifications";
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

export const initialActiveGameParamsState = {
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
    initialActiveGameParamsState
  );
  const walletSelector = useWalletSelector();

  const { data } = useContractParams();
  const { data: tokensData } = useWhiteListedTokens();

  const { height, width } = useScreenSize();
  const isLandscape = width > height * 1.5;
  console.log(
    new Date().toLocaleTimeString(),
    //document.visibilityState,
    //document.hasFocus(),
    data
  );

  useEffect(() => {
    if (isNotificationSupported()) {
      console.log("Notifications supported");
      askUserPermission();
    } else {
      console.log("Notifications NOT supported");
    }
  }, []);

  useEffect(() => {
    if (data?.active_game && !activeGameParams.game_id) {
      if (hasUserPermission()) {
        addNotification("You Have an Active Game");
      }
      setActiveGameParams({
        ...initialActiveGameParamsState,
        game_id: data.active_game[0],
        current_player: data.active_game[1].current_player,
        board: data.active_game[1].tiles,
        player1: data.active_game[1].player1,
        player2: data.active_game[1].player2,
      });
    }
  }, [activeGameParams.game_id, data?.active_game, walletSelector.accountId]);

  return (
    <Grid
      templateColumns={{
        base: "1fr",
        sm: isLandscape ? "1fr 1fr" : "1fr",
        md: "1fr 1fr",
      }}
      gap={4}
    >
      {data && tokensData && (
        <>
          <Info
            data={data}
            tokensData={tokensData}
            activeGameParams={activeGameParams}
            setActiveGameParams={setActiveGameParams}
          />
          <Board
            isLandscape={isLandscape}
            activeGameParams={activeGameParams}
            setActiveGameParams={setActiveGameParams}
          />
        </>
      )}
    </Grid>
  );
}
