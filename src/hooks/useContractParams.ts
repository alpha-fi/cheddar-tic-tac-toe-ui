import { useQuery } from "react-query";
import {
  useWalletSelector,
  WalletSelectorContextValue,
} from "../contexts/WalletSelectorContext";

type TokenContractId = string;
type AccountId = string;
export type GameId = number;

enum GameState {
  NotStarted,
  Active,
  Finished,
};

export interface GameConfigView {
  token_id: TokenContractId;
  deposit: string;
  opponent_id?: string;
  referrer_id?: string;
  created_at: number;
};

interface GameDeposit {
  token_id: TokenContractId;
  balance: string;
};

export interface GameParams {
  games: Record<GameId, GameView>;
  available_players: [string, GameConfigView][];
  service_fee_percentage: number;
  max_game_duration: number;
  last_update_timestamp_sec: number;
  active_game: [string, GameView] | undefined;
};

export interface ContractParams {
  games: Record<GameId, GameView>;
  available_players: [string, GameConfigView][];
  service_fee_percentage: number;
  max_game_duration: number;
  last_update_timestamp_sec: number;
};

export interface Coords {
  x: number;
  y: number;
};

export enum Piece {
  X,
  O,
};

export interface Tiles {
   o_coords: Coords[],
   x_coords: Coords[],
};

interface GameView {
  player1: AccountId;
  player2: AccountId;
  game_status: GameState;
  current_player: AccountId;
  reward: GameDeposit;
  tiles: Tiles;
  initiated_at_sec: number;
  last_turn_timestamp_sec: number;
  current_duration_sec: number;
};

interface Reward {
  balance: string;
  token_id: string;
}

/*
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
      ["O", "X", null],
      ["O", "X", null],
      [null, "O", null],
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
*/

const getParams = async (walletSelector: WalletSelectorContextValue) => {
  const resp = await walletSelector.tictactoeContract?.get_contract_params();
  return {...resp,active_game: Object.entries(resp?.games || {}).find(
    (entry) =>
      entry[1].player1 === walletSelector.accountId ||
      entry[1].player2 === walletSelector.accountId
  ),} as GameParams;
};

export const useContractParams = () => {
  const walletSelector = useWalletSelector();
  return useQuery<GameParams>(
    ["contractParams"],
    () => getParams(walletSelector),
    {
      refetchIntervalInBackground: true,
      refetchInterval: 4000,
      cacheTime: 0,
      notifyOnChangePropsExclusions: ["isStale", "isRefetching", "isFetching"],
    }
  );
};
