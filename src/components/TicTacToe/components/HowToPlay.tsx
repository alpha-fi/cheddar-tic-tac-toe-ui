import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
} from "@chakra-ui/react";
import { CircleIcon } from "../../../shared/components/CircleIcon";
import { CrossIcon } from "../../../shared/components/CrossIcon";

export function HowToPlay() {
  return (
    <AccordionItem bg="#fffc" borderRadius="0 0 8px 8px">
      <h2>
        <AccordionButton _focus={{ boxShadow: "0 0 0 0 #0000" }}>
          <Box flex="1" textAlign="center">
            <Text as="h2" textAlign="center" fontSize="1.1em" fontWeight="700">
              How to Play / Rules
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
        <Text>- There is a 3 by 3 grid.</Text>
        <Text>
          - One player will be{" "}
          <CircleIcon
            w="20px"
            h="20px"
            p="2px"
            borderRadius="4px"
            mx="5px"
            bg="#0009"
            color="yellowCheddar"
          />{" "}
          and the other{" "}
          <CrossIcon
            w="20px"
            h="20px"
            p="2px"
            borderRadius="4px"
            mx="5px"
            bg="#0009"
            color="yellowCheddar"
          />
          .{" "}
        </Text>
        <Text>- You will take turns to put your marks.</Text>
        <Text>
          - The first player to get 3 of their marks in a row (vertical,
          horizontal or diagonally) is the winner.
        </Text>
        <Text>- When all 9 squares are full, the game is over.</Text>
        <Text>
          - If no player has 3 markes in a row, the game ends in a tie
        </Text>
      </AccordionPanel>
    </AccordionItem>
  );
}
