import { Grid } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { useContractParams } from "../../../hooks/useContractParams";
import useScreenSize from "../../../hooks/useScreenSize";
import { useWhiteListedTokens } from "../../../hooks/useWhiteListedTokens";
import {
  addSWNotification,
  askUserPermission,
  hasUserPermission,
  isPushNotificationSupported,
  registerServiceWorker,
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
  const [boardSize, setBoardSize] = useState(0);

  const tictactoeContainer = useRef<HTMLDivElement | null>(null);

  const walletSelector = useWalletSelector();
  const { data } = useContractParams();
  const { data: tokensData } = useWhiteListedTokens();
  const { height, width } = useScreenSize();

  const isLandscape = width > height * 1.5;
  console.log(new Date().toLocaleTimeString(), data);

  useEffect(() => {
    if (isPushNotificationSupported()) {
      console.log("Notifications supported");
      askUserPermission();
    } else {
      console.log("Notifications NOT supported");
    }
    registerServiceWorker();
  }, []);

  useEffect(() => {
    if (data?.active_game && !activeGameParams.game_id) {
      if (hasUserPermission()) {
        addSWNotification("You Have an Active Game");
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

  useEffect(() => {
    if (tictactoeContainer.current) {
      const maxHeight = height - 180 > 346 ? height - 180 : 346;
      const isFullWidthBoard = width < 480 || (width < 768 && !isLandscape);
      const maxWidth = isFullWidthBoard
        ? tictactoeContainer.current.offsetWidth
        : (tictactoeContainer.current.offsetWidth - 20) / 2;
      setBoardSize(maxHeight > maxWidth ? maxWidth : maxHeight);
    }
  }, [tictactoeContainer.current?.offsetWidth, height, isLandscape, width]);

  return (
    <Grid
      templateColumns={{
        base: "1fr",
        sm: isLandscape ? "1fr 1fr" : "1fr",
        md: "1fr 1fr",
      }}
      gap="20px"
      ref={tictactoeContainer}
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
            boardSize={boardSize}
          />
        </>
      )}
    </Grid>
  );
}
