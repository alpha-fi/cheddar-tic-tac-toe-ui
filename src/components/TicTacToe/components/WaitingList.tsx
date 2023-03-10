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
import { useAvailablePlayers } from "../../../hooks/useContractParams";
import useScreenSize from "../../../hooks/useScreenSize";
import { WaiitingListElement } from "./WaiitingListElement";

type Props = {
  showingActiveGame: boolean;
  showingWaitingListForm: boolean;
};

export default function WaitingList({
  showingActiveGame,
  showingWaitingListForm,
}: Props) {
  const { data } = useAvailablePlayers();
  const walletSelector = useWalletSelector();
  const { width } = useScreenSize();

  return (
    <AccordionItem
      bg="#fffc"
      borderRadius={
        showingActiveGame && showingWaitingListForm
          ? "0"
          : showingActiveGame
          ? "0 0 8px 8px"
          : showingWaitingListForm
          ? "8px 8px 0 0"
          : "8px"
      }
    >
      <h2>
        <AccordionButton _focus={{ boxShadow: "0 0 0 0 #0000" }}>
          <Box flex="1" textAlign="center">
            <Text as="h2" textAlign="center" fontSize="1.1em" fontWeight="700">
              Available Players
            </Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel m="12px 16px" bg="#eee" borderRadius="8px" pb={4}>
        {data &&
          data.length ===
            data.filter(
              (player) =>
                player[0] !== walletSelector.accountId &&
                player[1].opponent_id &&
                player[1].opponent_id !== walletSelector.accountId
            ).length && (
            <Flex justifyContent="center" alignItems="center">
              <Text>No Players Available. Be The First!</Text>
            </Flex>
          )}
        {walletSelector.selector.isSignedIn() &&
          data
            ?.filter((player) => player[0] === walletSelector.accountId)
            .map((player, index) => (
              <Box key={player[0]}>
                {index === 0 && (
                  <Text fontWeight={700} mb="10px" textAlign="center">
                    My Challenge
                  </Text>
                )}
                <WaiitingListElement player={player} width={width} />
                <Spacer mb="30px" />
              </Box>
            ))}
        {walletSelector.selector.isSignedIn() &&
          data
            ?.filter(
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
                <WaiitingListElement player={player} width={width} />
                <Spacer mb="30px" />
              </Box>
            ))}
        {data
          ?.filter(
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
              <WaiitingListElement player={player} width={width} />
            </Box>
          ))}
      </AccordionPanel>
    </AccordionItem>
  );
}
