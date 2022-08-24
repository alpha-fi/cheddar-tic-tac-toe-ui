import { Box, Img } from "@chakra-ui/react";
import React, { useState } from "react";
import mouseIcon from "../../../assets/mouse-icon.svg";
import cheddarIcon from "../../../assets/cheddar-icon.svg";

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
  const [showIcon, setShowIcon] = useState(false);
  const border = "5px solid";
  const borderColor = "purpleCheddar";

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log(e.currentTarget.id);
    setShowIcon((prevState) => !prevState);
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
      >
        {showIcon && (
          <Img
            src={(column + row) % 2 === 0 ? mouseIcon : cheddarIcon}
            alt=""
            width="100%"
            height="100%"
          />
        )}
      </Box>
    </Box>
  );
}
