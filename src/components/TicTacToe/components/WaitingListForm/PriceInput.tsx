import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  //Input,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useGetUserCheddarBalances } from "../../../../hooks/useGetUserCheddarBalances";
import { isValidAmountInput } from "./helpers";
type Props = {
  bidInput: string;
  setBidInput: React.Dispatch<React.SetStateAction<string>>;
  minDeposit: string;
  tokenName: string;
};

const validValues = ["50","1000"]

export function PriceInput({
  bidInput,
  setBidInput,
  minDeposit,
  tokenName,
}: Props) {
  const handleBidInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isValidAmountInput(e.target.value)) {
      setBidInput(e.target.value);
    }
  };

  const [isBidValid, setBidValid] = useState(false);
  const { data: userCheddarBalancesData } = useGetUserCheddarBalances()

  useEffect(() => {
    setBidValid(
      parseFloat(bidInput) <= (userCheddarBalancesData?.gameBalance || 0)
    );
  }, [bidInput, userCheddarBalancesData?.gameBalance]);
  const bidInputBorderColor = isBidValid ? "inherit" : "red";

  useEffect(() => {
    setBidInput(validValues[0])
  }, [setBidInput])
  

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
        <Select
          w="200px"
          bg="#fffb"
          mr="10px"
          value={bidInput}
          onChange={handleBidInputChange}
          borderColor={bidInputBorderColor}
          boxShadow={`box-shadow: 0 0 0 1px ${bidInputBorderColor}`}
          _focus={{
            border: `1px solid ${bidInputBorderColor}`,
            boxShadow: `0 0 0 1px ${bidInputBorderColor}`,
            zIndex: 1,
          }}
        >
          {validValues.map((item) => (
            <option key={item} value={item}>{item} Cheddar</option>
          ))}
        </Select>
        {/* <Input
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
        /> */}
      </Flex>
      {!isBidValid && (
        <FormErrorMessage justifyContent="center" mt="0">
          Your deposited Cheddar amount is not enough
        </FormErrorMessage>
      )}
    </FormControl>
  );
}
