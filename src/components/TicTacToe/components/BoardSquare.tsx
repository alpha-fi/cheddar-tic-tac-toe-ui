import { Box, Flex, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import cheddarIcon from "../../../assets/cheddar-icon.svg";
import { useQuery } from "react-query";
import { GameParams } from "../../../hooks/useContractParams";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { getTransactionLastResult } from "near-api-js/lib/providers";
import { CircleIcon } from "../../../shared/components/CircleIcon";
import { CrossIcon } from "../../../shared/components/CrossIcon";
import { GameParamsState } from "../containers/TicTacToe";

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
};

export function BoardSquare({
  column,
  row,
  squareSize,
  activeGameParams,
  setActiveGameParams,
}: Props) {
  const [loading, setLoading] = useState(false);
  const walletSelector = useWalletSelector();
  const { data } = useQuery<GameParams>("contractParams");
  const dataTiles = data?.active_game?.[1].tiles || activeGameParams.tiles;
  const currentPlayer = data?.active_game?.[1].current_player.account_id;
  const border = "5px solid";
  const borderColor = "purpleCheddar";

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log(e.currentTarget.id);
    if (
      dataTiles &&
      dataTiles[row][column] === null &&
      currentPlayer === walletSelector.accountId
    ) {
      const gameId = parseInt(data?.active_game?.[0]!);
      console.log("play(", gameId, row, column, ")");
      setLoading(true);
      try {
        walletSelector.ticTacToeLogic?.play(gameId, row, column).then((r) => {
          setLoading(false);
          if (r.receipts_outcome[0].outcome.logs.length > 0) {
            if (r.receipts_outcome[0].outcome.logs[0].includes("expired")) {
              setActiveGameParams((prev) => {
                return {
                  ...prev,
                  winnerId: prev.opponentId,
                  winningAction: "your turn time has expired",
                  winnerReward: r.receipts_outcome[0].outcome.logs[1]
                    .split(":")[1]
                    .trim(),
                };
              });
            } else {
              setActiveGameParams((prev) => {
                return {
                  ...prev,
                  tiles: getTransactionLastResult(r),
                  winnerId: walletSelector.accountId,
                  winningAction: "You did 3 in a row",
                  winnerReward: r.receipts_outcome[0].outcome.logs[1]
                    .split(":")[1]
                    .trim(),
                };
              });
            }
          } else {
            setActiveGameParams((prev) => {
              return {
                ...prev,
                tiles: getTransactionLastResult(r),
              };
            });
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (data?.active_game) {
      setActiveGameParams((prev) => {
        return {
          ...prev,
          tiles: dataTiles,
        };
      });
      setLoading(false);
    }
  }, [dataTiles, data?.active_game, setActiveGameParams]);

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
        {activeGameParams.tiles[row][column] && (
          <Flex justifyContent="center" alignItems="center" h="100%">
            {activeGameParams.tiles[row][column] === "O" ? (
              <CircleIcon w="75%" h="75%" color="yellowCheddar" />
            ) : (
              <CrossIcon w="65%" h="65%" color="yellowCheddar" />
            )}
          </Flex>
        )}
        {loading && (
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
