import { Box, Flex, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import cheddarIcon from "../../../assets/cheddar-icon.svg";
import { useQuery } from "react-query";
import {  GameParams,Coords } from "../../../hooks/useContractParams";
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
    // account is not selected
    if(!walletSelector.accountId){
      setErrorMsg("Please connect to wallet.");
    }
    // Game is over
    if(activeGameParams.game_result.result){
      setErrorMsg("Game is Over.");
    }
   if (
      data?.active_game &&
      isSquareEmpty && 
      activeGameParams.current_player === walletSelector.accountId &&
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
      tiles !== activeGameParams.tiles &&
      currentPlayer
    ) {
      setActiveGameParams((prev) => {
        return {
          ...prev,
          tiles: tiles,
          current_player: currentPlayer,
        };
      });
      setLoadingSquare({ row: null, column: null });
      if (
        currentPlayer === walletSelector.accountId &&
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

  const isOCoord =  activeGameParams.tiles?.o_coords.find((coords: Coords)=> coords.x === row && coords.y === column) ? true : false
  const isXCoord =  activeGameParams.tiles?.x_coords.find((coords: Coords)=> coords.x === row && coords.y === column)? true : false

  // checking for both X AND O coords
  const isSquareEmpty = !isOCoord && !isXCoord

  const isAvailableToClick =
    isSquareEmpty &&
    activeGameParams.current_player === walletSelector.accountId &&
    loadingSquare.column === null &&
    loadingSquare.row === null;

  const isActiveTurn =
    data?.active_game &&
    activeGameParams.current_player === walletSelector.accountId &&
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
          {(isXCoord || isOCoord) && (
            <Flex justifyContent="center" alignItems="center" h="100%">
              {isOCoord ? (
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
