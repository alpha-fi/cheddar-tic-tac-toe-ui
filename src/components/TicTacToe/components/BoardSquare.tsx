import { Box } from "@chakra-ui/react";
import React from "react";

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

export function BoardSquare({ column, row, squareSize }: Props) {
  const border = "5px solid";
  const borderColor = "purpleCheddar";

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log(e.currentTarget.id);
  };
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
        cursor="pointer"
        id={`r${row}c${column}`}
        w="100%"
        h="100%"
        onClick={handleClick}
      ></Box>
    </Box>
  );
}
