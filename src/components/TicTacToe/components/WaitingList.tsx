import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { useContractParams } from "../../../hooks/useContractParams";
import { WaiitingListElement } from "./WaiitingListElement";

export default function WaitingList() {
  const { data } = useContractParams();
  const walletSelector = useWalletSelector();

  return (
    <AccordionItem bg="#fffc" borderRadius="8px 8px 0 0">
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="center">
            <Text as="h2" textAlign="center" fontSize="1.1em" fontWeight="700">
              Available Players
            </Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel m="12px 16px" bg="#eee" borderRadius="8px" pb={4}>
        {data?.available_players && data.available_players.length === 0 && (
          <Flex justifyContent="center" alignItems="center">
            <Text>No Players Availble. Be The First!</Text>
          </Flex>
        )}
        {walletSelector.selector.isSignedIn() &&
          data?.available_players &&
          data.available_players
            .filter((player) => player[0] === walletSelector.accountId)
            .map((player, index) => (
              <Box key={player[0]}>
                {index === 0 && (
                  <Text fontWeight={700} mb="10px" textAlign="center">
                    My Challenge
                  </Text>
                )}
                <WaiitingListElement player={player} />
                <Spacer mb="30px" />
              </Box>
            ))}
        {walletSelector.selector.isSignedIn() &&
          data?.available_players &&
          data.available_players
            .filter(
              (player) =>
                player[0] !== walletSelector.accountId &&
                player[1].opponent_id === walletSelector.accountId
            )
            .map((player, index) => (
              <Box key={player[0]}>
                {index === 0 && (
                  <Text fontWeight={700} mb="10px" textAlign="center">
                    Private Challenges
                  </Text>
                )}
                <WaiitingListElement player={player} />
                <Spacer mb="30px" />
              </Box>
            ))}
        {data?.available_players &&
          data.available_players
            .filter(
              (player) =>
                player[0] !== walletSelector.accountId && !player[1].opponent_id
            )
            .map((player, index) => (
              <Box key={player[0]}>
                {index === 0 && (
                  <Text fontWeight={700} mb="10px" textAlign="center">
                    Public Challenges
                  </Text>
                )}
                <WaiitingListElement player={player} />
              </Box>
            ))}
      </AccordionPanel>
    </AccordionItem>
  );
}
