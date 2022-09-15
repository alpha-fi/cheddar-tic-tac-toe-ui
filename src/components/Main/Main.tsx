import { Box, Container } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import { ErrorModal } from "../../shared/components/ErrorModal";
import { checkUrlResponse } from "../../shared/helpers/checkUrlResponse";
import { Footer } from "../Footer";
import Navbar from "../Navbar/containers/Navbar";
import { TicTacToe } from "../TicTacToe";

export default function Main() {
  const [errorMsg, setErrorMsg] = useState("");
  const walletSelector = useWalletSelector();
  useEffect(() => {
    if (walletSelector.accountId) {
      checkUrlResponse(walletSelector.accountId).then((resp) => {
        if (resp.type === "error") {
          setErrorMsg(resp.msg);
        }
      });
    }
  }, [walletSelector.accountId]);
  return (
    <Box>
      <Navbar />
      <Container maxW="container.xl" p="30px">
        <TicTacToe />
      </Container>
      <Footer />
      <ErrorModal msg={errorMsg} setMsg={setErrorMsg} />
    </Box>
  );
}
