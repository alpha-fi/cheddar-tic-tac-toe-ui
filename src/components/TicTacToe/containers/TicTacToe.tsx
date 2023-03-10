import { Grid } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import {
  GameId,
  Tiles,
  useCurrentUserActiveGame,
} from "../../../hooks/useContractParams";
import useScreenSize from "../../../hooks/useScreenSize";
import { getTokens } from "../../../shared/helpers/getTokens";
import {
  addSWNotification,
  askUserPermission,
  hasUserPermission,
  isPushNotificationSupported,
  registerServiceWorker,
} from "../../../shared/helpers/notifications";
import { GridSize } from "../../lib/constants";
import Board from "../components/Board";
import Info from "../components/Info";

export type GameParamsState = {
  game_id: GameId | null;
  game_result: { result: string | null; winner_id: string | null };
  player1: string | null;
  player2: string | null;
  current_player: string | null;
  reward: {
    token_id: string | null;
    balance: string | null;
  };
  tiles: Tiles | null;
  initiated_at_sec: number | null;
  last_turn_timestamp_sec: number | null;
  current_duration_sec: number | null;
  max_game_duration: number | null;
};

export const initialActiveGameParamsState = {
  game_id: null,
  game_result: { result: null, winner_id: null },
  player1: null,
  player2: null,
  current_player: null,
  reward: {
    token_id: null,
    balance: null,
  },
  tiles: null,
  initiated_at_sec: null,
  last_turn_timestamp_sec: null,
  current_duration_sec: null,
  max_game_duration: null,
};

export function TicTacToe() {
  const [activeGameParams, setActiveGameParams] = useState<GameParamsState>(
    initialActiveGameParamsState
  );
  const [boardSize, setBoardSize] = useState(0);
  const [data, setData] = useState<[GameId, GameParamsState]>();

  const tictactoeContainer = useRef<HTMLDivElement | null>(null);

  const walletSelector = useWalletSelector();

  const { data: tokensData } = useWhiteListedTokens();
  const { height, width } = useScreenSize();

  // const [allGames,setAllGames] = useState()
  const { data: activeGameData } = useCurrentUserActiveGame(
    activeGameParams.game_id
  );

  useEffect(() => {
    if (activeGameData && activeGameData !== data) {
      setData(activeGameData);
    }
  }, [activeGameData, data, setData]);

  const isLandscape = width > height * 1.5;

  useEffect(() => {
    // clear active games state on disconnecting account
    if (!walletSelector.accountId) {
      setActiveGameParams(initialActiveGameParamsState);
    }
  }, [walletSelector.accountId]);

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
    if (walletSelector.accountId && data?.[0] && !activeGameParams.game_id) {
      if (hasUserPermission()) {
        addSWNotification("You Have an Active Game");
      }
      setActiveGameParams({
        ...initialActiveGameParamsState,
        game_id: data[0],
        current_player: data[1].current_player,
        tiles: data[1].tiles,
        player1: data[1].player1,
        player2: data[1].player2,
        initiated_at_sec: data[1].initiated_at_sec,
        last_turn_timestamp_sec: data[1].last_turn_timestamp_sec,
        current_duration_sec: data[1].current_duration_sec,
        reward: data[1].reward,
        max_game_duration: data[1].max_game_duration,
      });
    }
  }, [activeGameParams.game_id, data?.[0], walletSelector.accountId]);

  useEffect(() => {
    if (tictactoeContainer.current) {
      const maxHeight = height - 160 > 346 ? height - 160 : 346;
      const isFullWidthBoard = width < 480 || (width < 768 && !isLandscape);
      const maxWidth = isFullWidthBoard
        ? tictactoeContainer.current.offsetWidth
        : (tictactoeContainer.current.offsetWidth - 20) / 2;
      setBoardSize(maxHeight > maxWidth ? maxWidth : maxHeight);
    }
  }, [tictactoeContainer.current?.offsetWidth, height, isLandscape, width]);

  const boardFirst =
    activeGameParams.game_id !== null &&
    (width < 480 || (!isLandscape && width < 768));

  function updateActiveParamsFromChild(value: GameParamsState) {
    setActiveGameParams(value);
  }

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
      {tokensData && (
        <>
          <Info
            boardFirst={boardFirst}
            isLandScape={isLandscape}
            boardSize={boardSize}
            data={data?.[1]}
            tokensData={tokensData}
            activeGameParams={activeGameParams}
            setActiveGameParams={updateActiveParamsFromChild}
          />
          <Board
            boardFirst={boardFirst}
            boardSize={boardSize}
            activeGameParams={activeGameParams}
            setActiveGameParams={updateActiveParamsFromChild}
          />
        </>
      )}
    </Grid>
  );
}
