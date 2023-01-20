import { Flex, Grid } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { GameParams } from "../../../hooks/useContractParams";
import { GridSize } from "../../lib/constants";
import { GameParamsState } from "../containers/TicTacToe";
import { BoardSquare } from "./BoardSquare";

export type LoadingSquare = {
  row: number | null;
  column: number | null;
};

type Props = {
  boardFirst: boolean;
  boardSize: number;
  activeGameParams: GameParamsState;
  setActiveGameParams: React.Dispatch<React.SetStateAction<GameParamsState>>;
};

export default function Board({
  boardFirst,
  boardSize,
  activeGameParams,
  setActiveGameParams,
}: Props) {
  const [loadingSquare, setLoadingSquare] = useState<LoadingSquare>({
    row: null,
    column: null,
  });
  const [grid, setGrid] = useState<JSX.Element[][]>([]);
  const { data } = useQuery<GameParams>("contractParams");

  useEffect(() => {
    if (
      data?.active_game === undefined &&
      loadingSquare.row !== null &&
      loadingSquare.column !== null
    ) {
      setLoadingSquare({ row: null, column: null });
    }
  }, [data?.active_game, loadingSquare]);

  useEffect(() => {
    let newGrid:JSX.Element[][] = [];
    for(let i = 0; i < GridSize.rows; i++) {
      let row:JSX.Element[] = [];
      for(let j = 0; j < GridSize.columns; j++) {
        row.push(
        <BoardSquare
          row={i}
          column={j}
          activeGameParams={activeGameParams}
          setActiveGameParams={setActiveGameParams}
          loadingSquare={loadingSquare}
          setLoadingSquare={setLoadingSquare}
        />
        );
      }
      newGrid.push(row);
    }
   setGrid(newGrid)
  }, [activeGameParams,loadingSquare,setActiveGameParams]);

  return (
    <Flex justifyContent="center">
      <Grid flex="1"
        style={{overflow:"auto"}}
        templateColumns={`repeat(${GridSize.columns},1fr)`}
        templateRows={`repeat(${GridSize.rows},1fr)`}
        height={boardSize}
        visibility={boardSize === 0 ? "hidden" : "inherit"}
        width={boardSize}
        bg="#333c"
        border="8px solid"
        borderRadius="8px"
        borderColor="purpleCheddar"
      >
        {grid.map((row: JSX.Element[], i) => (
           row.map((square, j) => (
           <>
           {square}
           </>
          ))
        ))}
      </Grid>
    </Flex>
  );
}
