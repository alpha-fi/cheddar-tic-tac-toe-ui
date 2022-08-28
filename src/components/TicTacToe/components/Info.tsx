import { Accordion } from "@chakra-ui/react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { GameParams } from "../../../hooks/useContractParams";
import WaitingList from "./WaitingList";
import WaitingListForm from "./WaitingListForm";
import { useEffect, useState } from "react";
import { ActiveGame } from "./ActiveGame";
import { HowToPlay } from "./HowToPlay";
import { GameParamsState } from "../containers/TicTacToe";

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

  console.log(data);
  return (
    <Accordion defaultIndex={[0]}>
      {!activeGameParams.gameId && <WaitingList />}

      {walletSelector.selector.isSignedIn() &&
        !activeGameParams.gameId &&
        !haveOwnChallenge && <WaitingListForm />}

      {activeGameParams.gameId && (
        <ActiveGame
          data={data}
          activeGameParams={activeGameParams}
          setActiveGameParams={setActiveGameParams}
        />
      )}

      <HowToPlay />
    </Accordion>
  );
}
