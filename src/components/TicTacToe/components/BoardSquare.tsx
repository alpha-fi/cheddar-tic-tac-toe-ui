import { Box, Flex, Spinner } from "@chakra-ui/react";
import React, { useEffect } from "react";
import cheddarIcon from "../../../assets/cheddar-icon.svg";
import { useQuery } from "react-query";
import { GameParams } from "../../../hooks/useContractParams";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
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
  const border = "5px solid";
  const borderColor = "purpleCheddar";
  const tiles = data?.active_game?.[1].tiles;
  const currentPlayer = data?.active_game?.[1].current_player;

  const handleClick = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (
      data?.active_game &&
      activeGameParams.board[row][column] === null &&
      activeGameParams.current_player.account_id === walletSelector.accountId &&
      loadingSquare.column === null &&
      loadingSquare.row === null
    ) {
      const gameId = parseInt(data?.active_game?.[0]!);
      setLoadingSquare({ row, column });
      try {
        if (walletSelector.ticTacToeLogic) {
          await walletSelector.ticTacToeLogic.play(gameId, row, column);
        }
      } catch (error) {
        console.error(error);
        setLoadingSquare({ row: null, column: null });
      }
    }
  };

  useEffect(() => {
    if (
      tiles &&
      tiles[row][column] !== activeGameParams.board[row][column] &&
      currentPlayer
    ) {
      setActiveGameParams((prev) => {
        return {
          ...prev,
          board: tiles,
          current_player: currentPlayer,
        };
      });
      setLoadingSquare({ row: null, column: null });
    }
  }, [
    activeGameParams,
    currentPlayer,
    column,
    row,
    setActiveGameParams,
    tiles,
    setLoadingSquare,
  ]);

  const isAvailableToClick =
    !activeGameParams.board[row][column] &&
    activeGameParams.current_player.account_id === walletSelector.accountId &&
    loadingSquare.column === null &&
    loadingSquare.row === null;

  const isActiveTurn =
    data?.active_game &&
    activeGameParams.current_player.account_id === walletSelector.accountId &&
    loadingSquare.row === null &&
    loadingSquare.column === null;

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
        cursor={isAvailableToClick ? "pointer" : "auto"}
        id={`r${row}c${column}`}
        w="100%"
        h="100%"
        onClick={handleClick}
        _hover={isAvailableToClick ? { bg: "#FFF4" } : {}}
      >
        {activeGameParams.board[row][column] && (
          <Flex justifyContent="center" alignItems="center" h="100%">
            {activeGameParams.board[row][column] === "O" ? (
              <CircleIcon
                w="75%"
                h="75%"
                color={isActiveTurn ? "yellowCheddar" : "#ffd26288"}
              />
            ) : (
              <CrossIcon
                w="65%"
                h="65%"
                color={isActiveTurn ? "yellowCheddar" : "#ffd26288"}
              />
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
