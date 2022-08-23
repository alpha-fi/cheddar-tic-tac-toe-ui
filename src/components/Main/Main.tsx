import { Box, Container } from "@chakra-ui/react";
import { Footer } from "../Footer";
import Navbar from "../Navbar/containers/Navbar";
import { TicTacToe } from "../TicTacToe";

export default function Main() {
  return (
    <Box>
      <Navbar />
      <Container maxW="container.xl" p="30px">
        <TicTacToe />
      </Container>
      <Footer />
    </Box>
  );
}
