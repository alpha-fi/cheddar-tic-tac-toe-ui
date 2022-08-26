import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Grid,
  Text,
} from "@chakra-ui/react";
import { utils } from "near-api-js";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { useContractParams } from "../../../hooks/useContractParams";
import { PurpleButton } from "../../../shared/components/PurpleButton";

export default function WaitingList() {
  const { data } = useContractParams();
  const walletSelector = useWalletSelector();

  const handleAcceptButton = (
    address: string,
    token_id: string,
    deposit: string,
    referrer_id?: string
  ) => {
    walletSelector.ticTacToeLogic?.acceptChallenge([
      address,
      {
        token_id: token_id,
        deposit: deposit,
        opponent_id: null,
        referrer_id: referrer_id ?? null,
      },
    ]);
  };

  return (
    <AccordionItem bg="#fffc">
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
        {data?.available_players &&
          data.available_players.map((player) => (
            <Grid key={player[0]} templateColumns="2.5fr 2fr 1fr">
              <Text textAlign="initial">{player[0]}</Text>
              <Text textAlign="initial">
                {utils.format.formatNearAmount(player[1].deposit)}{" "}
                {player[1].token_id}
              </Text>
              <PurpleButton
                size="sm"
                onClick={() =>
                  handleAcceptButton(
                    player[0],
                    player[1].token_id,
                    player[1].deposit
                  )
                }
              >
                Play!
              </PurpleButton>
            </Grid>
          ))}
      </AccordionPanel>
    </AccordionItem>
  );
}
