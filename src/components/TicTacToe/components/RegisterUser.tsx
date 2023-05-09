import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { ErrorModal } from "../../../shared/components/ErrorModal";
import { PurpleButton } from "../../../shared/components/PurpleButton";
import { getErrorMessage } from "../../../shared/helpers/getErrorMsg";

type Props = {
  isUserRegistered: boolean;
};
export function RegisterUser({ isUserRegistered }: Props) {
  const walletSelector = useWalletSelector();
  const [errorMsg, setErrorMsg] = useState("");
  const [showForm, setShowFrom] = useState(false);

  function registerUser() {
    walletSelector.ticTacToeLogic?.registerAccount().catch((error) => {
      console.error(error);
      setErrorMsg(getErrorMessage(error));
    });
  }

  function unRegisterUser() {
    walletSelector.ticTacToeLogic?.unregisterAccount().catch((error) => {
      console.error(error);
      setErrorMsg(getErrorMessage(error));
    });
  }

  return (
    <AccordionItem bg="#fffc" borderRadius={showForm ? "8px 8px 0 0" : "8px"}>
      <h2>
        <AccordionButton _focus={{ boxShadow: "0 0 0 0 #0000" }}>
          <Box flex="1" textAlign="center">
            <Text as="h2" textAlign="center" fontSize="1.1em" fontWeight="700">
              {isUserRegistered ? "Unregister" : "Register"} User
            </Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel m="12px 16px" bg="#eee" borderRadius="8px" pb={4}>
        {isUserRegistered ? (
          <>
            If you unregister, You will not be able to play any games in future
            unless you register again.
            <Flex justifyContent="center">
              <PurpleButton onClick={unRegisterUser}>Unregister</PurpleButton>
            </Flex>
          </>
        ) : (
          <>
            Before starting a game, You need to register yourself. Registration
            included payment of storage fees of 0.2 NEAR for the games config
            which you will play.
            <Flex justifyContent="center">
              <PurpleButton onClick={registerUser}>Register</PurpleButton>
            </Flex>
          </>
        )}
      </AccordionPanel>

      <ErrorModal msg={errorMsg} setMsg={setErrorMsg} />
    </AccordionItem>
  );
}
