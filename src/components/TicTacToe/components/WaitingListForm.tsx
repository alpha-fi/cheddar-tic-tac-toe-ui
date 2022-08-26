import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { PurpleButton } from "../../../shared/components/PurpleButton";

export default function WaitingListForm() {
  const [nearInput, setNearInput] = useState("0");
  const [withCheddar, setWithCheddar] = useState(false);
  const walletSelector = useWalletSelector();

  const params = new URLSearchParams(window.location.search);

  const referral = params.get("r") ?? undefined;
  console.log(referral);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNearInput(e.target.value);
  };

  const handleOnClick = () => {
    walletSelector.ticTacToeLogic?.bet(
      parseInt(nearInput),
      withCheddar,
      referral
    );
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "NEAR") {
      setWithCheddar(false);
    } else if (e.target.value === "CHEDDAR") {
      setWithCheddar(true);
    }
  };
  return (
    <AccordionItem bg="#fffc">
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="center">
            <Text as="h2" textAlign="center" fontSize="1.1em" fontWeight="700">
              Join Waiting List
            </Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel
        pb={4}
        bg="#eee"
        borderRadius="8px"
        justifyContent="space-between"
        alignItems="center"
        m="12px 16px"
      >
        <FormControl mb="10px">
          <Flex justifyContent="center" alignItems="center">
            <FormLabel textAlign="right">My&nbsp;Bid:</FormLabel>
            <Input
              onChange={handleInputChange}
              value={nearInput}
              type="text"
              w="100px"
              mr="10px"
              bg="white"
            />
            <Select maxW="130px" bg="#fffb" onChange={handleSelectChange}>
              <option>NEAR</option>
              <option disabled>CHEDDAR</option>
            </Select>
          </Flex>
        </FormControl>
        <Flex justifyContent="center">
          <PurpleButton onClick={handleOnClick}>Join Waiting List</PurpleButton>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
}
