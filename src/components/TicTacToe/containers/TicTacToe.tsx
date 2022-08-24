import { Grid } from "@chakra-ui/react";
import useScreenSize from "../../../hooks/useScreenSize";
import Board from "../components/Board";
import Info from "../components/Info";

export function TicTacToe() {
  const { height, width } = useScreenSize();
  const isLandscape = width > height * 1.5;
  return (
    <Grid
      templateColumns={{
        base: "1fr",
        sm: isLandscape ? "1fr 1fr" : "1fr",
        md: "1fr 1fr",
      }}
      gap={4}
    >
      <Info />
      <Board isLandscape={isLandscape} />
    </Grid>
  );
}
