import { useQuery } from "react-query";
import { RefreshIntervalMilliseconds } from "../components/lib/constants";
import { GameParamsState } from "../components/TicTacToe";
import {
  useWalletSelector,
  WalletSelectorContextValue,
} from "../contexts/WalletSelectorContext";
import { isNumberValid } from "../shared/helpers/common";

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

interface Reward {
  balance: string;
  token_id: string;
}

export interface WinnerDetails {
  Win: "Win";
  Tie: "Tie";
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

export const getAvailableGames = async (
  walletSelector: WalletSelectorContextValue
): Promise<[string, GameConfigView][] | undefined> => {
  const resp = await walletSelector.tictactoeContract?.get_available_players();
  return resp;
};

export const useAvailablePlayers = () => {
  const walletSelector = useWalletSelector();
  return useQuery<[string, GameConfigView][] | undefined>(
    ["availablePlayers"],
    () => getAvailableGames(walletSelector),
    {
      refetchIntervalInBackground: true,
      refetchInterval: RefreshIntervalMilliseconds,
      cacheTime: 0,
      notifyOnChangePropsExclusions: ["isStale", "isRefetching", "isFetching"],
    }
  );
};

export const getActiveGames = async (
  walletSelector: WalletSelectorContextValue
): Promise<[GameId, GameParamsState][] | undefined> => {
  const resp = await walletSelector.tictactoeContract?.get_active_games();
  return resp;
};

export const useActiveGames = () => {
  const walletSelector = useWalletSelector();
  return useQuery<[GameId, GameParamsState][] | undefined>(
    ["activeGames"],
    () => getActiveGames(walletSelector),
    {
      refetchIntervalInBackground: true,
      refetchInterval: RefreshIntervalMilliseconds,
      cacheTime: 0,
      notifyOnChangePropsExclusions: ["isStale", "isRefetching", "isFetching"],
    }
  );
};

export const getCurrentActiveGames = async (
  walletSelector: WalletSelectorContextValue
): Promise<[GameId, GameParamsState] | undefined> => {
  const resp = await walletSelector.tictactoeContract?.get_active_games();
  const currentActiveGame = resp?.filter(
    (game) =>
      game[1].player1 === walletSelector.accountId ||
      game[1].player2 === walletSelector.accountId
  )[0];
  if (typeof currentActiveGame?.[0] === "string") {
    currentActiveGame[0] = parseInt(currentActiveGame[0]);
  }
  return currentActiveGame;
};

// run the query only if no active game is found
export const useCurrentUserActiveGame = (activeGameID: any) => {
  const walletSelector = useWalletSelector();
  return useQuery<[GameId, GameParamsState] | undefined>(
    ["currentActiveGame"],
    () =>
      isNumberValid(activeGameID)
        ? undefined
        : getCurrentActiveGames(walletSelector),
    {
      refetchIntervalInBackground: true,
      refetchInterval: RefreshIntervalMilliseconds,
      cacheTime: 0,
      notifyOnChangePropsExclusions: ["isStale", "isRefetching", "isFetching"],
    }
  );
};

export const getMaxGameDuration = async (
  walletSelector: WalletSelectorContextValue
) => {
  const resp = await walletSelector.tictactoeContract?.get_max_game_duration();
  return resp;
};

export const getMaxTurnDuration = async (
  walletSelector: WalletSelectorContextValue
) => {
  const resp = await walletSelector.tictactoeContract?.get_max_turn_duration();
  return resp;
};

export const useMaxTurnDuration = () => {
  const walletSelector = useWalletSelector();
  return useQuery<number | undefined>(
    ["maxTurnDuration"],
    () => getMaxTurnDuration(walletSelector),
    {
      refetchIntervalInBackground: true,
      refetchInterval: 1000,
      cacheTime: 0,
      notifyOnChangePropsExclusions: ["isStale", "isRefetching", "isFetching"],
    }
  );
};
