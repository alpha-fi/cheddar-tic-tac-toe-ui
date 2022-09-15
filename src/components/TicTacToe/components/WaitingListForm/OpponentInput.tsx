import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useWalletSelector } from "../../../../contexts/WalletSelectorContext";

type Props = {
  opponentInput: {
    id: string;
    exist: boolean;
    loading: boolean;
  };
  setOpponentInput: React.Dispatch<
    React.SetStateAction<{
      id: string;
      exist: boolean;
      loading: boolean;
    }>
  >;
};

export function OpponentInput({ opponentInput, setOpponentInput }: Props) {
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const walletSelector = useWalletSelector();
  const handleOpponentInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    clearTimeout(timer);
    setOpponentInput({
      id: e.target.value,
      exist: false,
      loading: true,
    });
  };

  const borderColor =
    opponentInput.loading || opponentInput.id.trim() === ""
      ? "inherit"
      : opponentInput.exist
      ? "green"
      : "red";
  const focusBorderColor =
    opponentInput.loading || opponentInput.id.trim() === ""
      ? "#3182ce"
      : opponentInput.exist
      ? "green"
      : "red";

  useEffect(() => {
    if (opponentInput.id.trim() !== "") {
      let timerId = setTimeout(function () {
        walletSelector.ticTacToeLogic
          ?.getAccountBalance(opponentInput.id)
          .then((resp) => {
            console.log(resp);
            const balanceExists = !isNaN(parseInt(resp));
            setOpponentInput((prev) => {
              return {
                ...prev,
                loading: false,
                exist: balanceExists,
              };
            });
          })
          .catch((error) =>
            setOpponentInput((prev) => {
              return {
                ...prev,
                loading: false,
                exist: true,
              };
            })
          );
      }, 400);
      setTimer(timerId);
    }
  }, [opponentInput.id, setOpponentInput, walletSelector.ticTacToeLogic]);

  return (
    <FormControl mb="10px" isInvalid={borderColor === "red"}>
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
          <Text textAlign={{ base: "left", sm: "right" }}>Opponent:</Text>
          <Text fontSize="13px" textAlign={{ base: "left", sm: "right" }}>
            (optional)
          </Text>
        </FormLabel>
        <Input
          onChange={handleOpponentInputChange}
          value={opponentInput.id}
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
      <FormErrorMessage justifyContent="center" mt="0">
        This Account Doesn't exist
      </FormErrorMessage>
    </FormControl>
  );
}
