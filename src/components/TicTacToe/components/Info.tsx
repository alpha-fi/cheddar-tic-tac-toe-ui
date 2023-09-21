import { Accordion, Flex } from "@chakra-ui/react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import WaitingList from "./WaitingList";
import WaitingListForm from "./WaitingListForm/WaitingListForm";
import { useEffect, useState } from "react";
import { ActiveGame } from "./ActiveGame";
import { HowToPlay } from "./HowToPlay";
import { GameParamsState } from "../containers/TicTacToe";
import { UserStats } from "./Stats";
import { Referral } from "./Referral";
import { isNumberValid } from "../../../shared/helpers/common";
import { WhiteListedTokens } from "../../../shared/helpers/getTokens";
import { RegisterUser } from "./RegisterUser";
import { DepositCheddar } from "./DepositCheddar";

type Props = {
  boardFirst: boolean;
  boardSize: number;
  data: GameParamsState | undefined;
  tokensData: WhiteListedTokens[] | null;
  isLandScape: boolean;
  activeGameParams: GameParamsState;
  setActiveGameParams: (value: GameParamsState) => void;
  isUserRegistered: boolean;
  setUserRegistered: (value: boolean) => void;
  cheddarBalance: number | null;
};

export default function Info({
  boardFirst,
  boardSize,
  data,
  tokensData,
  isLandScape,
  activeGameParams,
  setActiveGameParams,
  isUserRegistered,
  setUserRegistered,
  cheddarBalance,
}: Props) {
  const [haveOwnChallenge, setHaveOwnChallenge] = useState(false);
  const walletSelector = useWalletSelector();

  useEffect(() => {
    if (data) {
      setHaveOwnChallenge(
        data.player1 === walletSelector.accountId ||
          data.player2 === walletSelector.accountId
      );
    } else {
      setHaveOwnChallenge(false);
    }
  }, [data, walletSelector.accountId]);

  const showActiveGame =
    isNumberValid(activeGameParams.game_id) ||
    activeGameParams?.game_result?.result;

  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      // gridRowStart={boardFirst ? "2" : "1"}
    >
      <Accordion
        width={isLandScape ? "100%" : boardSize}
        index={data ? 0 : undefined}
        defaultIndex={[0]}
        allowToggle
        mb="30px"
      >
        {!data && !activeGameParams.game_result.result && (
          <WaitingList
            showingActiveGame={activeGameParams.game_id !== null}
            showingWaitingListForm={
              walletSelector.selector.isSignedIn() && !data && !haveOwnChallenge
            }
            cheddarBalance={cheddarBalance}
            isUserRegistered={isUserRegistered}
          />
        )}
        {!data && !activeGameParams.game_result.result && (
          <RegisterUser isUserRegistered={isUserRegistered} setUserRegistered={setUserRegistered}/>
        )}
        {!data && !activeGameParams.game_result.result && (
          <DepositCheddar
            isUserRegistered={isUserRegistered}
            cheddarBalance={cheddarBalance}
          />
        )}

        {showActiveGame && (
          <ActiveGame
            activeGameParams={activeGameParams}
            setActiveGameParams={setActiveGameParams}
          />
        )}

        {walletSelector.selector.isSignedIn() &&
          !data &&
          !haveOwnChallenge &&
          tokensData && (
            <WaitingListForm
              tokensData={tokensData}
              isUserRegistered={isUserRegistered}
              cheddarBalance={cheddarBalance}
            />
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
