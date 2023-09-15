import { Button, Flex, Grid, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { GameConfigView } from "../../../hooks/useContractParams";
import { ErrorModal } from "../../../shared/components/ErrorModal";
import { PurpleButton } from "../../../shared/components/PurpleButton";
import { formatAccountId } from "../../../shared/helpers/formatAccountId";
import { getErrorMessage } from "../../../shared/helpers/getErrorMsg";
import TokenName from "./TokenName";

type Props = {
  player: [string, GameConfigView];
  width: number;
  isUserRegistered: boolean;
  cheddarBalance: number | null;
};

export function WaitingListElement({
  player,
  width,
  isUserRegistered,
  cheddarBalance,
}: Props) {
  const [errorMsg, setErrorMsg] = useState("");
  const walletSelector = useWalletSelector();

  const handleAcceptButton = (
    address: string,
    token_id: string,
    deposit: string,
    referrer_id?: string
  ) => {
    if (walletSelector.selector.isSignedIn()) {
      if (!cheddarBalance || +deposit! > cheddarBalance) {
        setErrorMsg("Insufficient deposited Cheddar balance.");
        return;
      }
      walletSelector.ticTacToeLogic
        ?.acceptChallenge([
          address,
          {
            token_id: token_id,
            deposit: deposit,
            opponent_id: undefined,
            referrer_id: referrer_id ?? undefined,
            created_at: undefined,
          },
        ])
        .catch((error) => {
          console.error(error);
          setErrorMsg(getErrorMessage(error));
        });
    } else {
      walletSelector.modal.show();
    }
  };

  const handleRemoveButton = () => {
    walletSelector.ticTacToeLogic?.removeBet().catch((error) => {
      console.error(error);
      setErrorMsg(getErrorMessage(error));
    });
  };

  const isSmallDesign = width < 480 || (width > 768 && width < 992);
  return (
    <>
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
              {player[1].deposit}&nbsp;
              {<TokenName tokenId={player[1].token_id} />}
            </Text>
          </Flex>
        ) : (
          <>
            <Text textAlign="initial">{formatAccountId(player[0], width)}</Text>
            <Text textAlign="initial">
              {player[1].deposit}&nbsp;
              {<TokenName tokenId={player[1].token_id} />}
            </Text>
          </>
        )}
        {player[0] !== walletSelector.accountId ? (
          <PurpleButton
            size="sm"
            onClick={() =>
              handleAcceptButton(
                player[0],
                player[1].token_id,
                player[1].deposit
              )
            }
            disabled={!isUserRegistered}
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
      <ErrorModal msg={errorMsg} setMsg={setErrorMsg} />
    </>
  );
}
