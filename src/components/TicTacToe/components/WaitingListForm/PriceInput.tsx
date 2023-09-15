import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { isValidAmountInput } from "./helpers";
type Props = {
  bidInput: string;
  setBidInput: React.Dispatch<React.SetStateAction<string>>;
  minDeposit: string;
  tokenName: string;
};
export function PriceInput({
  bidInput,
  setBidInput,
  minDeposit,
  tokenName,
}: Props) {
  const handleBidInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isValidAmountInput(e.target.value)) {
      setBidInput(e.target.value);
    }
  };

  const [isBidValid, setBidValid] = useState(false);

  useEffect(() => {
    setBidValid(
      bidInput.trim() === "" ||
        parseFloat(bidInput) === 50 ||
        parseFloat(bidInput) === 1000
    );
  }, [bidInput]);
  const borderColor = isBidValid ? "inherit" : "red";

  return (
    <FormControl mb="10px" isInvalid={!isBidValid}>
      <Flex
        justifyContent="center"
        alignItems="center"
        flexDirection={{ base: "column", sm: "row" }}
      >
        <FormLabel
          textAlign={{ base: "left", sm: "right" }}
          w={{ base: "190px", sm: "75px" }}
          mb="0"
        >
          My&nbsp;Bid:
        </FormLabel>
        <Input
          onChange={handleBidInputChange}
          value={bidInput}
          borderColor={borderColor}
          boxShadow={`box-shadow: 0 0 0 1px ${borderColor}`}
          _focus={{
            border: `1px solid ${borderColor}`,
            boxShadow: `0 0 0 1px ${borderColor}`,
            zIndex: 1,
          }}
          type="number"
          w="200px"
          mr="10px"
          bg="white"
        />
      </Flex>
      {!isBidValid && (
        <FormErrorMessage justifyContent="center" mt="0">
          Only 50 and 1000 Cheddars deposit is allowed
        </FormErrorMessage>
      )}
    </FormControl>
  );
}
