import { Flex, Grid } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { Coords, GameParams, Piece } from "../../../hooks/useContractParams";
import { useLastMove } from "../../../hooks/useLastMove";
import { getWinnerData, isObjectInArray } from "../../../shared/helpers/common";
import {
  addSWNotification,
  hasUserPermission,
} from "../../../shared/helpers/notifications";
import { GridSize } from "../../lib/constants";
import {
  GameParamsState,
  initialActiveGameParamsState,
} from "../containers/TicTacToe";
import { BoardSquare } from "./BoardSquare";

export type LoadingSquare = {
  row: number | null;
  column: number | null;
};

type Props = {
  boardFirst: boolean;
  boardSize: number;
  activeGameParams: GameParamsState;
  setActiveGameParams: (value: GameParamsState) => void;
  setConfetti: (value: boolean) => void;
};

export default function Board({
  boardFirst,
  boardSize,
  activeGameParams,
  setActiveGameParams,
  setConfetti,
}: Props) {
  const [loadingSquare, setLoadingSquare] = useState<LoadingSquare>({
    row: null,
    column: null,
  });
  const [grid, setGrid] = useState<JSX.Element[][]>([]);
  const [lastMoveData, setLastMoveData] = useState<
    [Coords | null, Piece, any, number | null] | undefined
  >(undefined);
  const { data } = useLastMove(activeGameParams.game_id);
  const walletSelector = useWalletSelector();

  function getWinnerDetails(winnerDetails: any) {
    const { result, winnerId } = getWinnerData(winnerDetails);
    if (result) {
      setActiveGameParams({
        ...initialActiveGameParamsState,
        game_result: {
          result: result,
          winner_id: winnerId,
        },
        reward: activeGameParams.reward,
      });
      if (winnerId === walletSelector.accountId) {
        setConfetti(true);
      }
      if (hasUserPermission()) {
        let msg;
        if (result === "Tie") {
          msg = "Game Over: Tied Game!";
        } else {
          if (winnerId === walletSelector.accountId) {
            msg = "Game Over: You Win!";
          } else {
            msg = "Game Over: You Lose!";
          }
        }
        addSWNotification(msg);
      }
    }
  }

  useEffect(() => {
    // filling last move data for the first time
    if (!lastMoveData && data) {
      setLastMoveData(data);
    }
    // on every last data difference updating tiles data
    if (lastMoveData && data && data?.[0]) {
      if (
        lastMoveData !== data ||
        (!activeGameParams.tiles?.x_coords.length &&
          !activeGameParams.tiles?.o_coords.length)
      ) {
        setLastMoveData(data);
        const currentPlayer =
          data?.[1] === Piece.O
            ? activeGameParams.player2
            : activeGameParams.player1;
        const updatedtiles = activeGameParams.tiles;
        if (data[1] === Piece.X) {
          // make sure it doesn't exist already
          if (!isObjectInArray(updatedtiles?.x_coords, data[0])) {
            updatedtiles?.x_coords.push(data[0]);
          }
        } else {
          if (!isObjectInArray(updatedtiles?.o_coords, data[0])) {
            updatedtiles?.o_coords.push(data[0]);
          }
        }
        setActiveGameParams({
          ...activeGameParams,
          tiles: updatedtiles,
          current_player: currentPlayer,
          last_turn_timestamp_sec: data?.[3],
        });
        setLoadingSquare({ row: null, column: null });
        if (currentPlayer === walletSelector.accountId && hasUserPermission()) {
          addSWNotification("Is Your Turn");
        }
      }
    }
  }, [
    data,
    activeGameParams,
    lastMoveData,
    walletSelector.accountId,
    setActiveGameParams,
    setLoadingSquare,
    setLastMoveData,
  ]);

  useEffect(() => {
    // game is over (result exists)
    if (
      data !== lastMoveData &&
      activeGameParams.game_id &&
      data?.[2]
    ) {
      setLastMoveData(data);
      getWinnerDetails(data?.[2]);
    }
  }, [data, activeGameParams.game_id]);

  useEffect(() => {
    if (
      activeGameParams === undefined &&
      loadingSquare.row !== null &&
      loadingSquare.column !== null
    ) {
      setLoadingSquare({ row: null, column: null });
    }
  }, [activeGameParams, loadingSquare]);

  useEffect(() => {
    let newGrid: JSX.Element[][] = [];
    for (let i = 0; i < GridSize.rows; i++) {
      let row: JSX.Element[] = [];
      for (let j = 0; j < GridSize.columns; j++) {
        row.push(
          <BoardSquare
            row={i}
            column={j}
            activeGameParams={activeGameParams}
            setActiveGameParams={setActiveGameParams}
            loadingSquare={loadingSquare}
            setLoadingSquare={setLoadingSquare}
            getWinnerDetails={getWinnerDetails}
          />
        );
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
  }, [activeGameParams, loadingSquare, setActiveGameParams]);

  return (
    <Flex justifyContent="center">
      <Grid
        flex="1"
        style={{ overflow: "auto" }}
        templateColumns={`repeat(${GridSize.columns},1fr)`}
        templateRows={`repeat(${GridSize.rows},1fr)`}
        height={boardSize}
        visibility={boardSize === 0 ? "hidden" : "inherit"}
        width={boardSize}
        bg="#333c"
        border="8px solid"
        borderRadius="8px"
        borderColor="purpleCheddar"
      >
        {grid.map((row: JSX.Element[], i) =>
          row.map((square, j) => <>{square}</>)
        )}
      </Grid>
    </Flex>
  );
}
