import { AbsoluteCenter, Grid, Img } from "@chakra-ui/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { GameId, Reward, Tiles } from "../../../hooks/useContractParams";
import useScreenSize from "../../../hooks/useScreenSize";
import { isNumberValid } from "../../../shared/helpers/common";
import {
  addSWNotification,
  askUserPermission,
  hasUserPermission,
  isPushNotificationSupported,
  registerServiceWorker,
} from "../../../shared/helpers/notifications";
import Board from "../components/Board";
import Info from "../components/Info";
import cheddarIcon from "../../../assets/cheddar-icon.svg";
import {
  getTokens,
  WhiteListedTokens,
} from "../../../shared/helpers/getTokens";
import { useCurrentUserActiveGame } from "../../../hooks/useActiveGame";

export type GameParamsState = {
  game_id: GameId | null;
  game_result: { result: string | null; winner_id: string | null };
  player1: string | null;
  player2: string | null;
  current_player: string | null;
  total_bet: Reward;
  tiles: Tiles | null;
  initiated_at_sec: number | null;
  last_turn_timestamp_sec: number | null;
  current_duration_sec: number | null;
};

export const initialActiveGameParamsState = {
  game_id: null,
  game_result: { result: null, winner_id: null },
  player1: null,
  player2: null,
  current_player: null,
  total_bet: {
    token_id: null,
    balance: null,
  },
  tiles: null,
  initiated_at_sec: null,
  last_turn_timestamp_sec: null,
  current_duration_sec: null,
};

type Props = {
  setConfetti: (value: boolean) => void;
};
export function TicTacToe({ setConfetti }: Props) {
  const [activeGameParams, setActiveGameParams] = useState<GameParamsState>(
    initialActiveGameParamsState
  ); // stores active game data first from contarct and then updates according to UI
  const [boardSize, setBoardSize] = useState(0);
  const [data, setData] = useState<[GameId, GameParamsState]>(); // stores the active games from contract
  const [isLoading, setLoading] = useState(false);
  const tictactoeContainer = useRef<HTMLDivElement | null>(null);
  const [tokensData, setTokensData] = useState<WhiteListedTokens[] | null>(
    null
  );
  const walletSelector = useWalletSelector();

  const { height, width } = useScreenSize();

  const { data: activeGameData, isFetching: isFetching } =
    useCurrentUserActiveGame(activeGameParams.game_id);

  useEffect(() => {
    setTokensData(getTokens());
  }, []);

  // // until all data is fetched showing loader
  // useLayoutEffect(() => {
  //   setLoading(isFetching);
  // }, [isFetching]);

  useEffect(() => {
    if (walletSelector.accountId && activeGameData && activeGameData !== data) {
      setData(activeGameData);
    }
  }, [walletSelector.accountId, activeGameData, data, setData]);

  const isLandscape = width > height * 1.5;

  useEffect(() => {
    // clear active games state on disconnecting account
    if (!walletSelector.accountId) {
      setData(undefined);
      setActiveGameParams(initialActiveGameParamsState);
    }
  }, [walletSelector.accountId]);

  useEffect(() => {
    // game is over
    if (data && activeGameParams.game_result.result) {
      setData(undefined);
    }
  }, [data, activeGameParams.game_result.result]);

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
    if (
      walletSelector.accountId &&
      data &&
      isNumberValid(data?.[0]) &&
      !activeGameParams.game_id &&
      !activeGameParams.game_result.result // checking result because we set empty state but only result data in Board
    ) {
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
        total_bet: data[1].total_bet,
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
    <>
      {isLoading ? (
        <AbsoluteCenter>
          <Img
            className="cheddar-icon"
            src={cheddarIcon}
            alt=""
            width="5rem"
            height="5rem"
          />
        </AbsoluteCenter>
      ) : (
        <Grid
          templateColumns={{
            base: "1fr",
            sm: isLandscape ? "1fr 1fr" : "1fr",
            md: "1fr 1fr",
          }}
          gap="20px"
          ref={tictactoeContainer}
        >
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
            boardSize={boardSize}
            activeGameParams={activeGameParams}
            setActiveGameParams={updateActiveParamsFromChild}
            setConfetti={setConfetti}
          />
        </Grid>
      )}
    </>
  );
}
