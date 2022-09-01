import { Accordion } from "@chakra-ui/react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { GameParams } from "../../../hooks/useContractParams";
import WaitingList from "./WaitingList";
import WaitingListForm from "./WaitingListForm";
import { useEffect, useState } from "react";
import { ActiveGame } from "./ActiveGame";
import { HowToPlay } from "./HowToPlay";
import { GameParamsState } from "../containers/TicTacToe";
import { UserStats } from "./Stats";

type Props = {
  data: GameParams | undefined;
  activeGameParams: GameParamsState;
  setActiveGameParams: React.Dispatch<React.SetStateAction<GameParamsState>>;
};

export default function Info({
  data,
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
    <Accordion defaultIndex={[0]}>
      {activeGameParams.game_id && (
        <ActiveGame
          data={data}
          activeGameParams={activeGameParams}
          setActiveGameParams={setActiveGameParams}
        />
      )}
      {!activeGameParams.game_id && <WaitingList />}

      {walletSelector.selector.isSignedIn() &&
        !activeGameParams.game_id &&
        !haveOwnChallenge && <WaitingListForm />}

      {walletSelector.selector.isSignedIn() && <UserStats data={data} />}
      <HowToPlay />
    </Accordion>
  );
}
