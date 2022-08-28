import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { GameParamsState } from "../containers/TicTacToe";
import { BoardSquare } from "./BoardSquare";

type Props = {
  isLandscape: boolean;
  activeGameParams: GameParamsState;
  setActiveGameParams: React.Dispatch<React.SetStateAction<GameParamsState>>;
};

export default function Board({
  isLandscape,
  activeGameParams,
  setActiveGameParams,
}: Props) {
  const boardSize = {
    base: "260px",
    sm: isLandscape ? "260px" : "350px",
    md: "350px",
    lg: "455px",
    "2xl": "605px",
  };
  const squareSize = {
    base: "80px",
    sm: isLandscape ? "80px" : "110px",
    md: "110px",
    lg: "145px",
    "2xl": "195px",
  };

  return (
    <Flex justifyContent="center">
      <Box
        height={boardSize}
        width={boardSize}
        bg="#333c"
        border="10px solid"
        borderRadius="8px"
        borderColor="purpleCheddar"
      >
        <Flex>
          <BoardSquare
            row={0}
            column={0}
            squareSize={squareSize}
            activeGameParams={activeGameParams}
            setActiveGameParams={setActiveGameParams}
          />
          <BoardSquare
            row={0}
            column={1}
            squareSize={squareSize}
            activeGameParams={activeGameParams}
            setActiveGameParams={setActiveGameParams}
          />
          <BoardSquare
            row={0}
            column={2}
            squareSize={squareSize}
            activeGameParams={activeGameParams}
            setActiveGameParams={setActiveGameParams}
          />
        </Flex>
        <Flex>
          <BoardSquare
            row={1}
            column={0}
            squareSize={squareSize}
            activeGameParams={activeGameParams}
            setActiveGameParams={setActiveGameParams}
          />
          <BoardSquare
            row={1}
            column={1}
            squareSize={squareSize}
            activeGameParams={activeGameParams}
            setActiveGameParams={setActiveGameParams}
          />
          <BoardSquare
            row={1}
            column={2}
            squareSize={squareSize}
            activeGameParams={activeGameParams}
            setActiveGameParams={setActiveGameParams}
          />
        </Flex>
        <Flex>
          <BoardSquare
            row={2}
            column={0}
            squareSize={squareSize}
            activeGameParams={activeGameParams}
            setActiveGameParams={setActiveGameParams}
          />
          <BoardSquare
            row={2}
            column={1}
            squareSize={squareSize}
            activeGameParams={activeGameParams}
            setActiveGameParams={setActiveGameParams}
          />
          <BoardSquare
            row={2}
            column={2}
            squareSize={squareSize}
            activeGameParams={activeGameParams}
            setActiveGameParams={setActiveGameParams}
          />
        </Flex>
      </Box>
    </Flex>
  );
}
