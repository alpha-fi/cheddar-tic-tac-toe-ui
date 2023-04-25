import { Action, FinalExecutionOutcome } from "@near-wallet-selector/core";
import { utils } from "near-api-js";
import { GameParamsState } from "../../components/TicTacToe";
import {
  ContractParams,
  Coords,
  GameConfigView,
  GameId,
  GameLimitedView,
  Piece,
  Tiles,
} from "../../hooks/useContractParams";
import { ENV, getEnv } from "../config";
import { DEFAULT_GAS, SelectorWallet } from "../wallet/wallet-selector";

export interface FinalizedGame {
  game_result: string | any;
  player1: string;
  player2: string;
  reward: {
    token_id: string;
    balance: string;
  };
  tiles: Tiles;
}

export interface Stats {
  referrer_id: string | null;
  games_played: number;
  victories_num: number;
  penalties_num: number;
  total_reward: [string, number][];
  total_affiliate_reward: [string, number][];
}

export interface PenaltiesStats {
  penalties_sum: number;
}

export class TicTacToeContract {
  contractId: string;

  constructor(public wallet: SelectorWallet) {
    this.contractId = getEnv(ENV).contractId;
  }

  make_available(deposit: string): Promise<any> {
    return this.wallet.call(
      this.contractId,
      "make_available",
      { config: {} },
      undefined,
      deposit
    );
  }

  make_unavailable(): Promise<any> {
    return this.wallet.call(this.contractId, "make_unavailable", {
      config: {},
    });
  }

  unregister_account(): Promise<any> {
    return this.wallet.call(this.contractId, "unregister_account", {
      config: {},
    });
  }

  getMakeAvailableAction(
    deposit: number | string,
    available_for?: number,
    referrer_id?: string,
    opponent_id?: string
  ): Action {
    const args: any = {};
    if (referrer_id) args["referrer_id"] = referrer_id;
    if (opponent_id) args["opponent_id"] = opponent_id;
    return {
      type: "FunctionCall",
      params: {
        methodName: "make_available",
        args: {
          game_config: args,
          available_for: available_for,
          bet:
            typeof deposit === "string"
              ? deposit
              : utils.format.parseNearAmount(deposit.toString())!,
        },
        gas: DEFAULT_GAS,
        deposit:
          typeof deposit === "string"
            ? deposit
            : utils.format.parseNearAmount(deposit.toString())!,
      },
    };
  }

  getMakeUnavailableAction(): Action {
    return {
      type: "FunctionCall",
      params: {
        methodName: "make_unavailable",
        args: {},
        gas: DEFAULT_GAS,
        deposit: "1",
      },
    };
  }

  getStartGameAction(opponent_id: string): Action {
    return {
      type: "FunctionCall",
      params: {
        methodName: "start_game",
        args: { player_2_id: opponent_id },
        gas: DEFAULT_GAS,
        deposit: "0",
      },
    };
  }

  storage_deposit(): Promise<any> {
    return this.wallet.call(
      this.contractId,
      "storage_deposit",
      { config: {} },
      undefined,
      "1.20"
    );
  }

  ft_on_transfer(): Promise<any> {
    return this.wallet.call(
      this.contractId,
      "ft_on_transfer",
      { config: {} },
      undefined,
      "0"
    );
  }

  getDisplayableAccountId(screenWidth: number): string {
    return this.wallet.getDisplayableAccountId(screenWidth);
  }

  /**
   *
   * @returns An array with the available players. On each element of the array you can find
   * two elements: the first one contains the player's account id. The second one, contains
   * information about the challenge
   */
  get_active_games(): Promise<[GameId, GameParamsState][]> {
    return this.wallet.view(this.contractId, "get_active_games", {});
  }

  get_account_balance(accountId: string): Promise<string> {
    return this.wallet.getAccountBalance(accountId);
  }

  get_last_games(): Promise<[number, FinalizedGame][]> {
    return this.wallet.view(this.contractId, "get_last_games", {});
  }

  get_available_players(): Promise<[string, GameConfigView][]> {
    return this.wallet.view(this.contractId, "get_available_players", {});
  }

  get_contract_params(): Promise<ContractParams> {
    return this.wallet.view(this.contractId, "get_contract_params", {});
  }

  get_token_min_deposit(accountId: string): Promise<string> {
    return this.wallet.view(this.contractId, "get_token_min_deposit", {
      token_id: accountId,
    });
  }

  get_last_move(
    game_id: GameId
  ): Promise<[Coords | null, Piece, any, number | null]> {
    return this.wallet.view(this.contractId, "get_last_move", { game_id });
  }

  make_move(
    game_id: number,
    row: number,
    col: number
  ): Promise<FinalExecutionOutcome> {
    return this.wallet.call(
      this.contractId,
      "make_move",
      { game_id, coords: { x: row, y: col } },
      undefined,
      "0"
    );
  }

  get_stats(): Promise<Stats> {
    return this.wallet.view(this.contractId, "get_stats", {
      account_id: this.wallet.getAccountId(),
    });
  }

  give_up(game_id: number): Promise<any> {
    return this.wallet.call(
      this.contractId,
      "give_up",
      { game_id },
      undefined,
      "1"
    );
  }

  get_user_penalties(): Promise<PenaltiesStats> {
    return this.wallet.view(this.contractId, "get_user_penalties", {
      account_id: this.wallet.getAccountId(),
    });
  }

  get_total_stats_num(): Promise<number> {
    return this.wallet.view(this.contractId, "get_total_stats_num", {});
  }

  get_accounts_played(): Promise<string[]> {
    return this.wallet.view(this.contractId, "get_accounts_played", {});
  }

  claim_timeout_win(game_id: number): Promise<FinalExecutionOutcome> {
    return this.wallet.call(
      this.contractId,
      "claim_timeout_win",
      { game_id },
      undefined,
      "0"
    );
  }

  get_game(game_id: number): Promise<GameLimitedView> {
    return this.wallet.view(this.contractId, "get_game", { game_id });
  }

  is_user_registered(account_id: string): Promise<boolean> {
    return this.wallet.view(this.contractId, "is_user_registered", {
      account_id,
    });
  }
}
