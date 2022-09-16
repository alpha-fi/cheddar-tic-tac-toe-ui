import { Box, Container, Link, useToast } from "@chakra-ui/react";
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
  const toast = useToast();
  useEffect(() => {
    if (walletSelector.accountId) {
      checkUrlResponse(walletSelector.accountId).then((resp) => {
        if (resp.type === "error") {
          setErrorMsg(resp.msg);
        } else if (resp.type === "success") {
          toast({
            title: resp.msg,
            description: (
              <Link
                target="_blank"
                fontSize=".8em"
                href={resp.url}
                textDecoration="underline"
                color="#fffb"
              >
                See Transaction Details
              </Link>
            ),
            position: "top-right",
            status: "success",
            duration: 6000,
            isClosable: true,
          });
        }
      });
    }
  }, [walletSelector.accountId, toast]);
  return (
    <Box>
      <Navbar />
      <Container maxW="container.xl" p="20px">
        <TicTacToe />
      </Container>
      <Footer />
      <ErrorModal msg={errorMsg} setMsg={setErrorMsg} />
    </Box>
  );
}
