import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { utils } from "near-api-js";
import { useState } from "react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { useGetIsUserRegistered } from "../../../hooks/useGetIsUserRegistered";
import { useGetUserCheddarBalances } from "../../../hooks/useGetUserCheddarBalances";
import { ErrorModal } from "../../../shared/components/ErrorModal";
import { PurpleButton } from "../../../shared/components/PurpleButton";
import { getErrorMessage } from "../../../shared/helpers/getErrorMsg";

export function DepositCheddar() {
  const minDeposit = 50;
  const walletSelector = useWalletSelector();
  const [errorMsg, setErrorMsg] = useState("");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const { data: isUserRegisteredData = false } = useGetIsUserRegistered()
  const { data: userCheddarBalancesData } = useGetUserCheddarBalances()
  
  async function depositCheddar() {
    if (parseFloat(amount) < minDeposit) {
      setAmountError(`Minimum deposit of ${minDeposit} Cheddars is required`);
      return;
    }
    if (parseFloat(amount) > parseFloat(utils.format.formatNearAmount(userCheddarBalancesData?.walletBalance || "0"))) {
      setAmountError(`Your NEAR account doesn't have enough balance`);
      return;
    }
    try {
      walletSelector.ticTacToeLogic?.depositCheddar(utils.format.parseNearAmount(amount)!)  
    } catch (error) {
      console.error(error);
      setErrorMsg(getErrorMessage(error));      
    }
  }

  async function withdrawCheddar() {
    if (amount && userCheddarBalancesData?.gameBalance) {
      if (parseFloat(amount) > userCheddarBalancesData.gameBalance) {
        setAmountError(`Maximum withdraw limit is ${userCheddarBalancesData.gameBalance} Cheddars`);
        return;
      }
      try {
        walletSelector.ticTacToeLogic?.withdrawCheddar(parseFloat(amount))
      } catch (error) {
        console.error(error);
        setErrorMsg(getErrorMessage(error));      
      }
    }
  }

  const borderColor = amountError ? "red" : "inherit";
  const focusBorderColor = amountError ? "red" : "#3182ce";

  return (
    <AccordionItem bg="#fffc" borderRadius={"8px"}>
      <h2>
        <AccordionButton _focus={{ boxShadow: "0 0 0 0 #0000" }}>
          <Box flex="1" textAlign="center">
            <Text as="h2" textAlign="center" fontSize="1.1em" fontWeight="700">
              Deposit{userCheddarBalancesData?.gameBalance ? "/Withdraw" : ""} Cheddar
            </Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel m="12px 16px" bg="#eee" borderRadius="8px" py={4}>
        <VStack gap="4px">
          {!isUserRegisteredData &&
            <Alert status='warning' fontWeight="700" px="12px">
              <AlertIcon />
              <Text w="100%" textAlign="center">
                You are not registered, with your cheddar deposit the registration will be included only this time in the deposit transaction (0.2 NEAR for storage)
              </Text>
            </Alert>
          }
          <Flex justifyContent="center">
            The deposited Cheddar can be used in bidding for playing a game.
          </Flex>
          <FormControl isInvalid={borderColor === "red"}>
            <Flex
              justifyContent="center"
              alignItems="center"
              flexDirection={{ base: "column", sm: "row" }}
            >
              <FormLabel
                w={{ base: "190px", sm: "75px" }}
                mb={{ base: "5px", sm: "0" }}
                textAlign={{ base: "left", sm: "right" }}
                lineHeight="1"
              >
                <Text textAlign={{ base: "left", sm: "right" }}>Cheddar:</Text>
              </FormLabel>
              <Input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAmountError("");
                  setAmount(e.target.value);
                }}
                value={amount?.toString()}
                borderColor={borderColor}
                boxShadow={`box-shadow: 0 0 0 1px ${borderColor}`}
                _focus={{
                  border: `1px solid ${focusBorderColor}`,
                  boxShadow: `0 0 0 1px ${focusBorderColor}`,
                  zIndex: 1,
                }}
                type="number"
                w="200px"
                mr="10px"
                bg="white"
              />
            </Flex>
            <FormErrorMessage justifyContent="center" mt="0">
              {amountError}
            </FormErrorMessage>          
          </FormControl>
          <Flex flexDir="row" gap={5} justifyContent="center">
            <PurpleButton
              onClick={depositCheddar}
            >
              Deposit
            </PurpleButton>
            {userCheddarBalancesData?.gameBalance ? (
              <PurpleButton
                onClick={withdrawCheddar}
              >
                Withdraw
              </PurpleButton>
            ) : null}
          </Flex>
        </VStack>
      </AccordionPanel>
      <ErrorModal msg={errorMsg} setMsg={setErrorMsg} />
    </AccordionItem>
  );
}
