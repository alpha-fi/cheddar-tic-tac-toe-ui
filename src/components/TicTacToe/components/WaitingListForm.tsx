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
  const [bidInput, setBidInput] = useState("0");
  const [opponentInput, setOpponentInput] = useState("");
  const [withCheddar, setWithCheddar] = useState(false);
  const walletSelector = useWalletSelector();

  const params = new URLSearchParams(window.location.search);

  const referral = params.get("r") ?? undefined;

  const handleBidInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBidInput(e.target.value);
  };

  const handleOpponentInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOpponentInput(e.target.value);
  };

  const handleOnClick = () => {
    walletSelector.ticTacToeLogic?.bet(
      parseInt(bidInput),
      withCheddar,
      referral,
      opponentInput.trim() === "" ? undefined : opponentInput
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
        <AccordionButton _focus={{ boxShadow: "0 0 0 0 #0000" }}>
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
              onChange={handleBidInputChange}
              value={bidInput}
              type="number"
              w="100px"
              mr="10px"
              bg="white"
            />
            <Select maxW="130px" bg="#fffb" onChange={handleSelectChange}>
              <option>NEAR</option>
              <option>CHEDDAR</option>
            </Select>
          </Flex>
        </FormControl>
        <FormControl mb="10px">
          <Flex justifyContent="center" alignItems="center">
            <FormLabel textAlign="right">Opponent (optional):</FormLabel>
            <Input
              onChange={handleOpponentInputChange}
              value={opponentInput}
              type="text"
              w="200px"
              mr="10px"
              bg="white"
            />
          </Flex>
        </FormControl>
        <Flex justifyContent="center">
          <PurpleButton onClick={handleOnClick}>Join Waiting List</PurpleButton>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
}
