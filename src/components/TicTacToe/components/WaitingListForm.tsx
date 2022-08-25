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
  Text,
} from "@chakra-ui/react";
import { PurpleButton } from "../../../shared/components/PurpleButton";

export default function WaitingListForm() {
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
            <FormLabel textAlign="right" w="100px">
              My&nbsp;Bid:
            </FormLabel>
            <Input type="text" w="100px" mr="10px" bg="white" />
            <Text w="100px">NEAR</Text>
          </Flex>
        </FormControl>
        <FormControl mb="10px">
          <Flex justifyContent="center" alignItems="center">
            <FormLabel textAlign="right" w="100px">
              Cheddar&nbsp;Bid:
            </FormLabel>
            <Input type="text" w="100px" mr="10px" bg="white" />
            <Text w="100px">CHEDDAR</Text>
          </Flex>
        </FormControl>
        <Flex justifyContent="center">
          <PurpleButton>Join Waiting List</PurpleButton>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
}
