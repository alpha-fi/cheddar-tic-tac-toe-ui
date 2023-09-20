import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { ErrorModal } from "../../../shared/components/ErrorModal";
import { PurpleButton } from "../../../shared/components/PurpleButton";
import { getErrorMessage } from "../../../shared/helpers/getErrorMsg";

type Props = {
  isUserRegistered: boolean;
  cheddarBalance: number | null;
};
export function DepositCheddar({ isUserRegistered, cheddarBalance }: Props) {
  const minDeposit = 50;
  const walletSelector = useWalletSelector();
  const [errorMsg, setErrorMsg] = useState("");
  const [amt, setAmount] = useState("");
  const [showForm, setShowFrom] = useState(false);
  const [depositError, setDepositError] = useState(false);
  const [withdrawError, setWithdrawError] = useState(false);

  function depositCheddar() {
    if (+amt < minDeposit) {
      setDepositError(true);
      return;
    }
    walletSelector.ticTacToeLogic?.depositCheddar(+amt).catch((error) => {
      console.error(error);
      setErrorMsg(getErrorMessage(error));
    });
  }

  function withdrawCheddar() {
    if (amt && cheddarBalance) {
      if (+amt > cheddarBalance) {
        setWithdrawError(true);
        return;
      }
      walletSelector.ticTacToeLogic?.withdrawCheddar(+amt).catch((error) => {
        console.error(error);
        setErrorMsg(getErrorMessage(error));
      });
    }
  }

  const error = depositError || withdrawError;
  const borderColor = error ? "red" : "inherit";
  const focusBorderColor = error ? "red" : "#3182ce";

  return (
    <AccordionItem bg="#fffc" borderRadius={showForm ? "8px 8px 0 0" : "8px"}>
      <h2>
        <AccordionButton _focus={{ boxShadow: "0 0 0 0 #0000" }}>
          <Box flex="1" textAlign="center">
            <Text as="h2" textAlign="center" fontSize="1.1em" fontWeight="700">
              Deposit{cheddarBalance ? "/Withdraw" : ""} Cheddar
            </Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel m="12px 16px" bg="#eee" borderRadius="8px" pb={4}>
        <FormControl mb="10px" isInvalid={borderColor === "red"}>
          {!isUserRegistered &&
            <Flex justifyContent="center" fontWeight="700">
              To deposit Cheddar you have to register first.
            </Flex>
          }
          <Flex justifyContent="center">
            The deposited Cheddar can be used in bidding for playing a game.
          </Flex>
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
                setWithdrawError(false);
                setDepositError(false);
                setAmount(e.target.value);
              }}
              value={amt?.toString()}
              borderColor={borderColor}
              boxShadow={`box-shadow: 0 0 0 1px ${borderColor}`}
              _focus={{
                border: `1px solid ${focusBorderColor}`,
                boxShadow: `0 0 0 1px ${focusBorderColor}`,
                zIndex: 1,
              }}
              type="text"
              w="200px"
              mr="10px"
              bg="white"
            />
          </Flex>
          {error && (
            <FormErrorMessage justifyContent="center" mt="0">
              {depositError
                ? "Minimum deposit of " + minDeposit + " Cheddars is required"
                : "Maximum withdraw limit is " + cheddarBalance + " Cheddars"}
            </FormErrorMessage>
          )}
        </FormControl>
        <Flex flexDir="row" gap={5} justifyContent="center">
          <PurpleButton
            onClick={depositCheddar}
            disabled={depositError || !isUserRegistered}
          >
            Deposit
          </PurpleButton>
          {cheddarBalance ? (
            <PurpleButton
              onClick={withdrawCheddar}
              disabled={withdrawError || !isUserRegistered}
            >
              Withdraw
            </PurpleButton>
          ) : null}
        </Flex>
      </AccordionPanel>
      <ErrorModal msg={errorMsg} setMsg={setErrorMsg} />
    </AccordionItem>
  );
}
