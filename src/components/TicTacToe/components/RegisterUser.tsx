import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  Box,
  Flex,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { useGetIsUserRegistered } from "../../../hooks/useGetIsUserRegistered";
import { ErrorModal } from "../../../shared/components/ErrorModal";
import { PurpleButton } from "../../../shared/components/PurpleButton";
import { getErrorMessage } from "../../../shared/helpers/getErrorMsg";

export function RegisterUser() {
  const walletSelector = useWalletSelector();
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const { data: isUserRegisteredData = false } = useGetIsUserRegistered()
  const queryClient = useQueryClient()

  async function registerUser() {
    // account is not selected
    if (!walletSelector.accountId) {
      setErrorMsg("Please connect to wallet.");
      return
    }
    try {
      await walletSelector.ticTacToeLogic?.registerAccount()
    } catch (error) {
      console.error(error);
      setErrorMsg(getErrorMessage(error));
    }
  }

  const unRegisterUser = async () => {
    setIsLoading(true)
    try {
      await walletSelector.ticTacToeLogic?.unregisterAccount()
      await queryClient.refetchQueries()
    } catch (error) {
      console.error(error);
      setErrorMsg(getErrorMessage(error));
    }
    setIsLoading(false)
  }

  return (
    <AccordionItem bg="#fffc" borderRadius={"8px"}>
      <h2>
        <AccordionButton _focus={{ boxShadow: "0 0 0 0 #0000" }}>
          <Box flex="1" textAlign="center">
            <Text as="h2" textAlign="center" fontSize="1.1em" fontWeight="700">
              {isUserRegisteredData ? "Unregister" : "Register"} User
            </Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel m="12px 16px" bg="#eee" borderRadius="8px" py={4}>
        {isUserRegisteredData ? (
          <VStack gap="4px">
            <Alert status='warning' fontWeight="700" px="12px">
              <AlertIcon />
              <Text w="100%" textAlign="center">
                If you unregister, You will not be able to play any games in future unless you register again.
              </Text>
            </Alert>
            
            <Flex justifyContent="center">
              <PurpleButton onClick={unRegisterUser} isLoading={isLoading}>Unregister</PurpleButton>
            </Flex>
          </VStack>
        ) : (
          <VStack gap="4px">
            <Text textAlign="center" mb="10px">  
              Before starting a game, You need to register yourself. Registration
              included payment of storage fees of 0.2 NEAR for the games config
              which you will play.
            </Text>
            <Flex justifyContent="center">
              <PurpleButton onClick={registerUser}>Register</PurpleButton>
            </Flex>
          </VStack>
        )}
      </AccordionPanel>

      <ErrorModal msg={errorMsg} setMsg={setErrorMsg} />
    </AccordionItem>
  );
}
