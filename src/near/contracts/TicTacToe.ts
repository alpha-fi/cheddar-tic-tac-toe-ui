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
    return this.wallet.call(
      this.contractId,
      "make_unavailable",
      {},
      undefined,
      "0"
    );
  }

  unregister_account(): Promise<any> {
    return this.wallet.call(
      this.contractId,
      "unregister_account",
      { config: {} },
      undefined,
      "0"
    );
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
          bet: deposit,
        },
        gas: DEFAULT_GAS,
        deposit: "0",
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
        deposit: "0",
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

  getStorageDepositAction(deposit: number): Action {
    return {
      type: "FunctionCall",
      params: {
        methodName: "storage_deposit",
        args: {},
        gas: DEFAULT_GAS,
        deposit: utils.format.parseNearAmount(deposit.toString())!,
      },
    };
  }

  getUnregisterCallAction(): Action {
    return {
      type: "FunctionCall",
      params: {
        methodName: "unregister_account",
        args: { config: {} },
        gas: DEFAULT_GAS,
        deposit: "0",
      },
    };
  }

  getWithdrawCallAction(amount: number): Action {
    return {
      type: "FunctionCall",
      params: {
        methodName: "withdraw_cheddar",
        args: { amount },
        gas: DEFAULT_GAS,
        deposit: "1",
      },
    };
  }

  storage_deposit(): Promise<any> {
    return this.wallet.call(
      this.contractId,
      "storage_deposit",
      { config: {} },
      undefined,
      utils.format.parseNearAmount("0.2") ?? undefined // 0.2 NEAR
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

  get_cheddar_balance(): Promise<number> {
    return this.wallet.view(this.contractId, "get_cheddar_balance", {
      account_id: this.wallet.getAccountId(),
    });
  }

  withdraw_cheddar(cheddar: number): Promise<number> {
    return this.wallet.call(
      this.contractId,
      "withdraw_cheddar",
      { amount: cheddar },
      undefined,
      "1"
    );
  }
}
