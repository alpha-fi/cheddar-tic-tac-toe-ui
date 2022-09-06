import { Button, Flex, Grid, Text } from "@chakra-ui/react";
import { utils } from "near-api-js";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { AvailablePlayerConfig } from "../../../near/contracts/TicTacToe";
import { PurpleButton } from "../../../shared/components/PurpleButton";
import { formatAccountId } from "../../../shared/helpers/formatAccountId";
import TokenName from "./TokenName";

type Props = {
  player: [string, AvailablePlayerConfig];
  width: number;
};

export function WaiitingListElement({ player, width }: Props) {
  const walletSelector = useWalletSelector();

  const handleAcceptButton = (
    address: string,
    token_id: string,
    deposit: string,
    referrer_id?: string
  ) => {
    if (walletSelector.selector.isSignedIn()) {
      walletSelector.ticTacToeLogic?.acceptChallenge([
        address,
        {
          token_id: token_id,
          deposit: deposit,
          opponent_id: null,
          referrer_id: referrer_id ?? null,
        },
      ]);
    } else {
      walletSelector.modal.show();
    }
  };

  const handleRemoveButton = () => {
    walletSelector.ticTacToeLogic?.removeBet();
  };

  const isSmallDesign = width < 480 || (width > 768 && width < 992);
  return (
    <Grid
      mb="5px"
      bg="#1111"
      templateColumns={isSmallDesign ? "2.5fr 1fr" : "2.2fr 2fr 1fr"}
      p="6px 12px"
      borderRadius="8px"
      alignItems="center"
    >
      {isSmallDesign ? (
        <Flex flexDirection="column" fontSize="0.9em">
          <Text textAlign="initial">{formatAccountId(player[0], width)}</Text>
          <Text textAlign="initial">
            {utils.format.formatNearAmount(player[1].deposit)}&nbsp;
            {<TokenName tokenId={player[1].token_id} />}
          </Text>
        </Flex>
      ) : (
        <>
          <Text textAlign="initial">{formatAccountId(player[0], width)}</Text>
          <Text textAlign="initial">
            {utils.format.formatNearAmount(player[1].deposit)}&nbsp;
            {<TokenName tokenId={player[1].token_id} />}
          </Text>
        </>
      )}
      {player[0] !== walletSelector.accountId ? (
        <PurpleButton
          size="sm"
          onClick={() =>
            handleAcceptButton(player[0], player[1].token_id, player[1].deposit)
          }
        >
          Play!
        </PurpleButton>
      ) : (
        <Button
          colorScheme="red"
          size="sm"
          borderRadius="full"
          onClick={handleRemoveButton}
        >
          Remove
        </Button>
      )}
    </Grid>
  );
}
