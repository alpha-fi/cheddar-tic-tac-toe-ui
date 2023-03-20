import { WalletSelectorContextValue } from "../contexts/WalletSelectorContext";

type TokenContractId = string;
type AccountId = string;
export type GameId = number;

enum GameState {
  NotStarted,
  Active,
  Finished,
}

export interface GameConfigView {
  token_id: TokenContractId;
  deposit: string;
  opponent_id?: string;
  referrer_id?: string;
  created_at?: number;
}

interface GameDeposit {
  token_id: TokenContractId;
  balance: string;
}

export interface GameParams {
  games: Record<GameId, GameView>;
  available_players: [string, GameConfigView][];
  service_fee_percentage: number;
  max_game_duration: number;
  last_update_timestamp_sec: number;
  active_game: [GameId, GameView] | undefined;
}

export interface ContractParams {
  games: Record<GameId, GameView>;
  available_players: [string, GameConfigView][];
  service_fee_percentage: number;
  max_game_duration: number;
  last_update_timestamp_sec: number;
}

export interface Coords {
  x: number;
  y: number;
}

export enum Piece {
  X = "X",
  O = "O",
}

export interface Tiles {
  o_coords: Coords[];
  x_coords: Coords[];
}

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
}

export interface Reward {
  balance: string | null;
  token_id: string | null;
}

export interface WinnerDetails {
  Win: "Win";
  Tie: "Tie";
}

export interface GameLimitedView {
  game_result: string;
  player1: AccountId;
  player2: AccountId;
  reward_or_tie_refund: GameDeposit;
  tiles: Tiles;
  last_move: Tiles;
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
*/

export const getContractParams = async (
  walletSelector: WalletSelectorContextValue
): Promise<GameParams | undefined> => {
  const resp = await walletSelector.tictactoeContract?.get_contract_params();
  return {
    ...resp,
    active_game: Object.entries(resp?.games || {}).find(
      (entry) =>
        entry[1].player1 === walletSelector.accountId ||
        entry[1].player2 === walletSelector.accountId
    ),
  } as GameParams;
};

export const getGameParams = async (
  walletSelector: WalletSelectorContextValue,
  gameID: number
) => {
  const resp = await walletSelector.tictactoeContract?.get_game(gameID);
  return resp;
};
