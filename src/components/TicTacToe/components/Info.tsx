import { Accordion, Box } from "@chakra-ui/react";
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

type Props = {
  data: GameParams | undefined;
  tokensData: WhiteListedTokens[];
  activeGameParams: GameParamsState;
  setActiveGameParams: React.Dispatch<React.SetStateAction<GameParamsState>>;
};

export default function Info({
  data,
  tokensData,
  activeGameParams,
  setActiveGameParams,
}: Props) {
  const [haveOwnChallenge, setHaveOwnChallenge] = useState(false);
  const walletSelector = useWalletSelector();

  useEffect(() => {
    if (data?.available_players) {
      setHaveOwnChallenge(
        data.available_players.filter(
          (player) => player[0] === walletSelector.accountId
        ).length > 0
      );
    }
  }, [data?.available_players, walletSelector.accountId]);

  return (
    <Box>
      <Accordion
        index={data?.active_game ? 0 : undefined}
        defaultIndex={[0]}
        allowToggle
        mb="30px"
      >
        {activeGameParams.game_id && (
          <ActiveGame
            data={data}
            activeGameParams={activeGameParams}
            setActiveGameParams={setActiveGameParams}
          />
        )}
        {!data?.active_game && (
          <WaitingList
            showingActiveGame={activeGameParams.game_id !== null}
            showingWaitingListForm={
              walletSelector.selector.isSignedIn() &&
              !data?.active_game &&
              !haveOwnChallenge
            }
          />
        )}
        {walletSelector.selector.isSignedIn() &&
          !data?.active_game &&
          !haveOwnChallenge && <WaitingListForm tokensData={tokensData} />}
      </Accordion>

      <Accordion allowToggle>
        {walletSelector.selector.isSignedIn() && <UserStats data={data} />}
        <HowToPlay
          showingReferral={walletSelector.accountId !== null}
          showingStats={walletSelector.selector.isSignedIn()}
        />
        {walletSelector.accountId && (
          <Referral accountId={walletSelector.accountId} />
        )}
      </Accordion>
    </Box>
  );
}
