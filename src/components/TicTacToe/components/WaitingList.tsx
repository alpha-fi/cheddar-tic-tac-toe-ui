import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";

export default function WaitingList() {
  return (
    <AccordionItem bg="#fffc">
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="center">
            <Text as="h2" textAlign="center" fontSize="1.1em" fontWeight="700">
              Availble Players
            </Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <Flex
          bg="#eee"
          borderRadius="8px"
          justifyContent="center"
          alignItems="center"
          p="12px 16px"
        >
          <Text>No Players Availble. Be The First!</Text>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
}
