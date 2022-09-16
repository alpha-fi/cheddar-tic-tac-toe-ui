import { Flex, Grid } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { GameParams } from "../../../hooks/useContractParams";
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

  return (
    <Flex justifyContent="center">
      <Grid
        templateColumns="1fr 1fr 1fr"
        templateRows="1fr 1fr 1fr"
        height={boardSize}
        visibility={boardSize === 0 ? "hidden" : "inherit"}
        width={boardSize}
        bg="#333c"
        border="10px solid"
        borderRadius="8px"
        borderColor="purpleCheddar"
      >
        <BoardSquare
          row={0}
          column={0}
          activeGameParams={activeGameParams}
          setActiveGameParams={setActiveGameParams}
          loadingSquare={loadingSquare}
          setLoadingSquare={setLoadingSquare}
        />
        <BoardSquare
          row={0}
          column={1}
          activeGameParams={activeGameParams}
          setActiveGameParams={setActiveGameParams}
          loadingSquare={loadingSquare}
          setLoadingSquare={setLoadingSquare}
        />
        <BoardSquare
          row={0}
          column={2}
          activeGameParams={activeGameParams}
          setActiveGameParams={setActiveGameParams}
          loadingSquare={loadingSquare}
          setLoadingSquare={setLoadingSquare}
        />
        <BoardSquare
          row={1}
          column={0}
          activeGameParams={activeGameParams}
          setActiveGameParams={setActiveGameParams}
          loadingSquare={loadingSquare}
          setLoadingSquare={setLoadingSquare}
        />
        <BoardSquare
          row={1}
          column={1}
          activeGameParams={activeGameParams}
          setActiveGameParams={setActiveGameParams}
          loadingSquare={loadingSquare}
          setLoadingSquare={setLoadingSquare}
        />
        <BoardSquare
          row={1}
          column={2}
          activeGameParams={activeGameParams}
          setActiveGameParams={setActiveGameParams}
          loadingSquare={loadingSquare}
          setLoadingSquare={setLoadingSquare}
        />
        <BoardSquare
          row={2}
          column={0}
          activeGameParams={activeGameParams}
          setActiveGameParams={setActiveGameParams}
          loadingSquare={loadingSquare}
          setLoadingSquare={setLoadingSquare}
        />
        <BoardSquare
          row={2}
          column={1}
          activeGameParams={activeGameParams}
          setActiveGameParams={setActiveGameParams}
          loadingSquare={loadingSquare}
          setLoadingSquare={setLoadingSquare}
        />
        <BoardSquare
          row={2}
          column={2}
          activeGameParams={activeGameParams}
          setActiveGameParams={setActiveGameParams}
          loadingSquare={loadingSquare}
          setLoadingSquare={setLoadingSquare}
        />
      </Grid>
    </Flex>
  );
}
