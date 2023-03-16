import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Text,
} from "@chakra-ui/react";
import { DefaultValues } from "../../../lib/constants";

type Props = {
  timeInput: number;
  setTimeInput: React.Dispatch<React.SetStateAction<number>>;
};

export function AvailableTimeInput({ timeInput, setTimeInput }: Props) {
  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeInput(+e.target.value);
  };

  const MinutesExtensionBtn = ({ timePeriod }: { timePeriod: number }) => {
    return (
      <Button
        onClick={() => setTimeInput((prev) => prev + timePeriod)}
        colorScheme="purple"
        variant="outline"
        size="xs"
      >
        + {timePeriod} mins
      </Button>
    );
  };
  const borderColor =
    timeInput >= DefaultValues.MIN_AVAILABLE_PLAYER_TIME ? "inherit" : "red";

  return (
    <FormControl mb="10px">
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
          <Text textAlign={{ base: "left", sm: "right" }}>Time:</Text>
          <Text fontSize="13px" textAlign={{ base: "left", sm: "right" }}>
            (in minutes)
          </Text>
        </FormLabel>
        <Input
          onChange={handleTimeInputChange}
          value={timeInput}
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
      <FormHelperText>
        <HStack gap="2px" justifyContent="center" wrap="wrap">
          <MinutesExtensionBtn timePeriod={2} />
          <MinutesExtensionBtn timePeriod={5} />
          <MinutesExtensionBtn timePeriod={10} />
          <MinutesExtensionBtn timePeriod={30} />
        </HStack>
      </FormHelperText>
    </FormControl>
  );
}
