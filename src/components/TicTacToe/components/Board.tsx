import { Flex, Grid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { Coords, Piece } from "../../../hooks/useContractParams";
import { useLastMove } from "../../../hooks/useLastMove";
import {
  getWinnerData,
  isNumberValid,
  isObjectInArray,
} from "../../../shared/helpers/common";
import { addSWNotification } from "../../../shared/helpers/notifications";
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
  boardSize: number;
  activeGameParams: GameParamsState;
  setActiveGameParams: (value: GameParamsState) => void;
  setConfetti: (value: boolean) => void;
};

const BoardBGColor = "#2D2727";

export default function Board({
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
  const queryClient = useQueryClient()
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
        tiles: activeGameParams.tiles,
        total_bet: activeGameParams.total_bet,
        game_id: activeGameParams.game_id,
      });
      if (winnerId === walletSelector.accountId) {
        setConfetti(true);
      }

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

  useEffect(() => {
    // on every last data difference updating tiles data
    if (data && data?.[0]) {
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
          last_turn_timestamp: data?.[3],
        });
        // display it only if the result is not declared
        if (data?.[2]) return;
        // scroll to that particular move on board and color the block to red
        const block = document.getElementById(`r${data[0].x}c${data[0].y}`);
        if (block) {
          block.style.backgroundColor = "red";
          setTimeout(() => {
            block.style.backgroundColor = BoardBGColor;
          }, 5000);
          block.scrollIntoView({ block: "center", inline: "center" });
        }
        setLoadingSquare({ row: null, column: null });
        if (currentPlayer === walletSelector.accountId) {
          addSWNotification("It's Your Turn");
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
      isNumberValid(activeGameParams.game_id) &&
      data?.[2]
    ) {
      const finishGame = async () => {
        setLastMoveData(data);
        setLoadingSquare({ row: null, column: null });
        // update the cheddar balance also (in case user lost or won)
        await queryClient.refetchQueries()
        getWinnerDetails(data?.[2]);
      }
      finishGame()
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
        bg={BoardBGColor}
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
