import { Accordion, Flex } from "@chakra-ui/react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { GameParams } from "../../../hooks/useContractParams";
import WaitingList from "./WaitingList";
import WaitingListForm from "./WaitingListForm/WaitingListForm";
import { useEffect, useState } from "react";
import { ActiveGame } from "./ActiveGame";
import { HowToPlay } from "./HowToPlay";
import { GameParamsState } from "../containers/TicTacToe";
import { UserStats } from "./Stats";
import { Referral } from "./Referral";
import { WhiteListedTokens } from "../../../hooks/useWhiteListedTokens";
import { isGameIDValid } from "../../../shared/helpers/common";

type Props = {
  boardFirst: boolean;
  boardSize: number;
  data: GameParamsState | undefined;
  tokensData: WhiteListedTokens[];
  isLandScape: boolean;
  activeGameParams: GameParamsState;
  setActiveGameParams: (value: GameParamsState) => void;
};

export default function Info({
  boardFirst,
  boardSize,
  data,
  tokensData,
  isLandScape,
  activeGameParams,
  setActiveGameParams,
}: Props) {
  const [haveOwnChallenge, setHaveOwnChallenge] = useState(false);
  const walletSelector = useWalletSelector();

  useEffect(() => {
    if (data) {
      setHaveOwnChallenge(
        data.player1 === walletSelector.accountId ||
          data.player2 === walletSelector.accountId
      );
    }
  }, [data, walletSelector.accountId]);

  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      gridRowStart={boardFirst ? "2" : "1"}
    >
      <Accordion
        width={isLandScape ? "100%" : boardSize}
        index={data ? 0 : undefined}
        defaultIndex={[0]}
        allowToggle
        mb="30px"
      >
        {isGameIDValid(activeGameParams.game_id) && (
          <ActiveGame
            activeGameParams={activeGameParams}
            setActiveGameParams={setActiveGameParams}
          />
        )}
        {!data && (
          <WaitingList
            showingActiveGame={activeGameParams.game_id !== null}
            showingWaitingListForm={
              walletSelector.selector.isSignedIn() && !data && !haveOwnChallenge
            }
          />
        )}
        {walletSelector.selector.isSignedIn() && !data && !haveOwnChallenge && (
          <WaitingListForm tokensData={tokensData} />
        )}
      </Accordion>

      <Accordion allowToggle width={isLandScape ? "100%" : boardSize}>
        {walletSelector.selector.isSignedIn() && <UserStats data={data} />}
        <HowToPlay
          showingReferral={walletSelector.accountId !== null}
          showingStats={walletSelector.selector.isSignedIn()}
        />
        {walletSelector.accountId && (
          <Referral accountId={walletSelector.accountId} />
        )}
      </Accordion>
    </Flex>
  );
}
