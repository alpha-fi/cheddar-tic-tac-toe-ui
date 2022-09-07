import { Box, Flex, Spinner } from "@chakra-ui/react";
import React, { useEffect } from "react";
import cheddarIcon from "../../../assets/cheddar-icon.svg";
import { useQuery } from "react-query";
import { GameParams } from "../../../hooks/useContractParams";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { getTransactionLastResult } from "near-api-js/lib/providers";
import { CircleIcon } from "../../../shared/components/CircleIcon";
import { CrossIcon } from "../../../shared/components/CrossIcon";
import { GameParamsState } from "../containers/TicTacToe";
import { LoadingSquare } from "./Board";

type Props = {
  column: number;
  row: number;
  squareSize: {
    base: string;
    sm: string;
    md: string;
    lg: string;
    "2xl": string;
  };
  activeGameParams: GameParamsState;
  setActiveGameParams: React.Dispatch<React.SetStateAction<GameParamsState>>;
  loadingSquare: LoadingSquare;
  setLoadingSquare: React.Dispatch<React.SetStateAction<LoadingSquare>>;
};

export function BoardSquare({
  column,
  row,
  squareSize,
  activeGameParams,
  setActiveGameParams,
  loadingSquare,
  setLoadingSquare,
}: Props) {
  const walletSelector = useWalletSelector();
  const { data } = useQuery<GameParams>("contractParams");
  const currentPlayer = data?.active_game?.[1].current_player.account_id;
  const border = "5px solid";
  const borderColor = "purpleCheddar";

  const handleClick = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    console.log(e.currentTarget.id);
    if (
      activeGameParams.board[row][column] === null &&
      currentPlayer === walletSelector.accountId
    ) {
      const gameId = parseInt(data?.active_game?.[0]!);
      console.log("play(", gameId, row, column, ")");
      setLoadingSquare({ row, column });
      try {
        if (walletSelector.ticTacToeLogic) {
          const response = await walletSelector.ticTacToeLogic.play(
            gameId,
            row,
            column
          );
          setActiveGameParams((prev) => {
            return {
              ...prev,
              board: getTransactionLastResult(response),
            };
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSquare({ row: null, column: null });
      }
    }
  };

  const tiles = data?.active_game?.[1].tiles;
  useEffect(() => {
    if (tiles && tiles[row][column] !== activeGameParams.board[row][column]) {
      setActiveGameParams((prev) => {
        return {
          ...prev,
          board: tiles,
        };
      });
      //setLoading(false);
      setLoadingSquare({ row: null, column: null });
    }
  }, [
    activeGameParams.board,
    column,
    row,
    setActiveGameParams,
    tiles,
    setLoadingSquare,
  ]);

  return (
    <Box
      height={squareSize}
      width={squareSize}
      borderTop={row > 0 ? border : "0px"}
      borderBottom={row < 2 ? border : "0px"}
      borderLeft={column > 0 ? border : "0px"}
      borderRight={column < 2 ? border : "0px"}
      borderColor={borderColor}
    >
      <Box
        cursor={currentPlayer === walletSelector.accountId ? "pointer" : "auto"}
        id={`r${row}c${column}`}
        w="100%"
        h="100%"
        onClick={handleClick}
      >
        {activeGameParams.board[row][column] && (
          <Flex justifyContent="center" alignItems="center" h="100%">
            {activeGameParams.board[row][column] === "O" ? (
              <CircleIcon w="75%" h="75%" color="yellowCheddar" />
            ) : (
              <CrossIcon w="65%" h="65%" color="yellowCheddar" />
            )}
          </Flex>
        )}
        {loadingSquare.column === column && loadingSquare.row === row && (
          <Flex h="100%" justifyContent="center" alignItems="center">
            <Spinner
              thickness="0px"
              speed="0.65s"
              size="xl"
              bgImage={cheddarIcon}
            />
          </Flex>
        )}
      </Box>
    </Box>
  );
}
