import { Box, Flex, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import cheddarIcon from "../../../assets/cheddar-icon.svg";
import { useQuery } from "react-query";
import { GameParams } from "../../../hooks/useContractParams";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { CircleIcon } from "../../../shared/components/CircleIcon";
import { CrossIcon } from "../../../shared/components/CrossIcon";
import { GameParamsState } from "../containers/TicTacToe";
import { LoadingSquare } from "./Board";
import {
  addSWNotification,
  askUserPermission,
  hasUserPermission,
} from "../../../shared/helpers/notifications";
import { ErrorModal } from "../../../shared/components/ErrorModal";
import { getErrorMessage } from "../../../shared/helpers/getErrorMsg";
import { GridSize } from "../../lib/constants";

type Props = {
  column: number;
  row: number;
  activeGameParams: GameParamsState;
  setActiveGameParams: React.Dispatch<React.SetStateAction<GameParamsState>>;
  loadingSquare: LoadingSquare;
  setLoadingSquare: React.Dispatch<React.SetStateAction<LoadingSquare>>;
};

export function BoardSquare({
  column,
  row,
  activeGameParams,
  setActiveGameParams,
  loadingSquare,
  setLoadingSquare,
}: Props) {
  const [errorMsg, setErrorMsg] = useState("");

  const walletSelector = useWalletSelector();
  const { data } = useQuery<GameParams>("contractParams");
  const border = "0.3px solid";
  const borderColor = "purpleCheddar";
  const tiles = data?.active_game?.[1].tiles;
  const currentPlayer = data?.active_game?.[1].current_player;

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (
      data?.active_game &&
      activeGameParams.board[row][column] === null &&
      activeGameParams.current_player.account_id === walletSelector.accountId &&
      loadingSquare.column === null &&
      loadingSquare.row === null
    ) {
      const gameId = parseInt(data?.active_game?.[0]!);
      askUserPermission();
      setLoadingSquare({ row, column });
      if (walletSelector.ticTacToeLogic) {
        walletSelector.ticTacToeLogic
          .play(gameId, row, column)
          .catch((error) => {
            console.error(error);
            setErrorMsg(getErrorMessage(error));
            setLoadingSquare({ row: null, column: null });
          });
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
      if (
        currentPlayer.account_id === walletSelector.accountId &&
        hasUserPermission()
      ) {
        addSWNotification("Is Your Turn");
      }
    }
  }, [
    activeGameParams,
    currentPlayer,
    column,
    row,
    tiles,
    walletSelector.accountId,
    setActiveGameParams,
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
    <>
      <Box
        minHeight="1.5rem"
        maxHeight="100%"
        minWidth="1.5rem"
        maxWidth="100%"
        borderTop={row > 0 ? border : "0px"}
        borderBottom={row < GridSize.rows ? border : "0px"}
        borderLeft={column > 0 ? border : "0px"}
        borderRight={column < GridSize.columns ? border : "0px"}
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
                bgImage={cheddarIcon}
              />
            </Flex>
          )}
        </Box>
      </Box>
      <ErrorModal msg={errorMsg} setMsg={setErrorMsg} />
    </>
  );
}
