import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import {
  AccordionItem,
  Flex,
  IconButton,
  Input,
  Text,
  useClipboard,
} from "@chakra-ui/react";
import { useState } from "react";
type Props = {
  accountId: string;
};
export function Referral({ accountId }: Props) {
  const [value] = useState(`${window.location.href}/?r=${accountId}`);
  const { hasCopied, onCopy } = useClipboard(value);

  return (
    <AccordionItem bg="#fffc" borderRadius="0 0 8px 8px">
      <Flex
        m="12px 16px 12px 16px"
        flexDirection="column"
        bg="#bbbb"
        borderRadius="8px"
        pb={4}
      >
        <Text m="8px 16px" textAlign="center">
          Invite A Friend To Get A Referral Bonus:
        </Text>
        <Flex mx="16px">
          <Input
            colorScheme="white"
            fontSize="0.75em"
            bg="white"
            value={value}
            isReadOnly
            placeholder="Welcome"
          />
          <IconButton
            borderRadius="16px"
            aria-label="Copy link"
            bgColor="purpleCheddar"
            colorScheme="purple"
            icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
            onClick={onCopy}
            ml={2}
          ></IconButton>
        </Flex>
      </Flex>
    </AccordionItem>
  );
}
