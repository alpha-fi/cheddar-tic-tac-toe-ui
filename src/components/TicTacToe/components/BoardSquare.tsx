import { Box, Img } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import mouseIcon from "../../../assets/mouse-icon.svg";
import cheddarIcon from "../../../assets/cheddar-icon.svg";
import { useQuery } from "react-query";
import { GameParams } from "../../../hooks/useContractParams";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";

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
};

const initialTiles: ("O" | "X" | null)[][] = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

export function BoardSquare({ column, row, squareSize }: Props) {
  const [tiles, settiles] = useState(initialTiles);
  const walletSelector = useWalletSelector();
  const { data } = useQuery<GameParams>("contractParams");
  const dataTiles = data?.active_game?.[1].tiles || initialTiles;
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
      walletSelector.ticTacToeLogic?.play(gameId, row, column);
    }
  };

  useEffect(() => {
    if (data?.active_game) {
      settiles(dataTiles);
    }
  }, [dataTiles, data?.active_game]);

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
        {tiles[row][column] && (
          <Img
            src={tiles[row][column] === "O" ? cheddarIcon : mouseIcon}
            alt=""
            width="100%"
            height="100%"
          />
        )}
      </Box>
    </Box>
  );
}
