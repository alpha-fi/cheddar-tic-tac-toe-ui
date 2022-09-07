import { useQuery } from "react-query";
import {
  useWalletSelector,
  WalletSelectorContextValue,
} from "../contexts/WalletSelectorContext";
import { AvailablePlayerConfig } from "../near/contracts/TicTacToe";

export interface GameParams {
  active_game: [string, ActiveGameData] | undefined;
  games?: object | undefined;
  available_players?: [string, AvailablePlayerConfig][] | undefined;
  service_fee_percentage?: string | undefined;
  max_game_duration?: string | undefined;
}

interface CurrentPlayer {
  account_id: string;
  piece: "O" | "X" | null;
}

interface Reward {
  balance: string;
  token_id: string;
}
interface ActiveGameData {
  current_duration_sec: number;
  current_player: CurrentPlayer;
  game_status: string;
  initiated_at_sec: number;
  last_turn_timestamp_sec: number;
  player1: string;
  player2: string;
  reward: Reward;
  tiles: ("O" | "X" | null)[][];
}

const testData: [string, ActiveGameData] = [
  "3",
  {
    current_duration_sec: 0,
    current_player: { piece: "X", account_id: "cookie-monster.testnet" },
    game_status: "Active",
    initiated_at_sec: 1661958737,
    last_turn_timestamp_sec: 0,
    player1: "cookie-monster.testnet",
    player2: "oreos.testnet",
    reward: { balance: "1000000000000000000000000", token_id: "near" },
    tiles: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
  },
];

const getParams = async (walletSelector: WalletSelectorContextValue) => {
  const resp = await walletSelector.tictactoeContract?.get_contract_params();
  return {
    ...resp,
    active_game: resp?.max_game_duration ? testData : undefined,
  };
};

export const useContractParams = () => {
  const walletSelector = useWalletSelector();
  return useQuery<GameParams>(
    ["contractParams"],
    () => getParams(walletSelector),
    {
      refetchInterval: 4000,
      cacheTime: 0,
      notifyOnChangePropsExclusions: ["isStale", "isRefetching", "isFetching"],
    }
  );
};
