import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { utils } from "near-api-js";
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
  const borderColor =
    bidInput.trim() === "" ||
    parseFloat(bidInput) >=
      parseFloat(utils.format.formatNearAmount(minDeposit))
      ? "inherit"
      : "red";

  return (
    <FormControl
      mb="10px"
      isInvalid={
        parseFloat(bidInput) <
        parseFloat(utils.format.formatNearAmount(minDeposit))
      }
    >
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
      <FormErrorMessage justifyContent="center" mt="0">
        Minimun Deposit: {utils.format.formatNearAmount(minDeposit)} {tokenName}
      </FormErrorMessage>
    </FormControl>
  );
}
