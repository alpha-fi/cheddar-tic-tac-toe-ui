import { Box, Container, Link, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import { getUserRegisterStatus } from "../../hooks/useContractParams";
import Confetti from "../../shared/components/Confetti";
import { ErrorModal } from "../../shared/components/ErrorModal";
import { checkUrlResponse } from "../../shared/helpers/checkUrlResponse";
import { getWinnerData } from "../../shared/helpers/common";
import { Footer } from "../Footer";
import Navbar from "../Navbar/containers/Navbar";
import { TicTacToe } from "../TicTacToe";

export default function Main() {
  const [errorMsg, setErrorMsg] = useState("");
  const walletSelector = useWalletSelector();
  const toast = useToast();
  const [isConfettiVisible, setShowConfetti] = useState(false);
  const [isUserRegistered, setUserRegistered] = useState(false);

  useEffect(() => {
    getUserRegisterStatus(walletSelector).then((resp) => {
      setUserRegistered(resp);
    });
  }, []);

  useEffect(() => {
    if (walletSelector.accountId) {
      checkUrlResponse(walletSelector.accountId).then((resp) => {
        if (resp.type === "error") {
          setErrorMsg(resp.msg);
        } else if (resp.type === "success") {
          let winnerDetailsMsg: string | null = null;
          // check for winner details
          if (typeof resp.data === "object") {
            const { result, winnerId } = getWinnerData(resp.data);
            if (walletSelector.accountId === winnerId) {
              winnerDetailsMsg = "You Won!";
              setShowConfetti(true);
            } else {
              if (result === "Tie") {
                winnerDetailsMsg = "Tied Game!";
              } else {
                winnerDetailsMsg = "You Lost!";
              }
            }
          }
          toast({
            title: winnerDetailsMsg ?? resp.msg,
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

  function handleConfetti(value: boolean) {
    setShowConfetti(value);
  }

  return (
    <>
      <Confetti isVisible={isConfettiVisible} />
      <Box>
        <Navbar
          setUserRegistered={(value) => setUserRegistered(value)}
          isUserRegistered={isUserRegistered}
        />
        <Container maxW="container.xl" p="20px">
          <TicTacToe
            setConfetti={handleConfetti}
            setUserRegistered={(value) => setUserRegistered(value)}
            isUserRegistered={isUserRegistered}
          />
        </Container>
        <Footer />
        <ErrorModal msg={errorMsg} setMsg={setErrorMsg} />
      </Box>
    </>
  );
}
