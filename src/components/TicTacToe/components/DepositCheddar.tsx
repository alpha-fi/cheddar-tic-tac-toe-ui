import {
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
  } from "@chakra-ui/react";
  import { utils } from "near-api-js";
import { useState } from "react";

  type Props = {
    depositedAmount:number | null
    isUserRegistered: boolean;
    setUserRegistered: (value: boolean) => void;
  };
  export function DepositCheddar({
    isUserRegistered,setUserRegistered,depositedAmount
  }: Props) {
  const [depositAmt,setAmount] = useState(depositedAmount)
  
    return (
      <FormControl
        mb="10px"
        // isInvalid={
        //   parseFloat(depositAmt) <
        //   parseFloat(utils.format.formatNearAmount())
        // }
      >
       
      </FormControl>
    );
  }
  