import { Action, FinalExecutionOutcome } from "@near-wallet-selector/core";
import { utils } from "near-api-js";
import { ENV, getEnv } from "../config";
import { DEFAULT_GAS, SelectorWallet } from "../wallet/wallet-selector";

export interface AvailablePlayerConfig {
  token_id: string;
  deposit: string;
  opponent_id: string | null;
  referrer_id: string | null;
}

export interface ContractParams {
  games: object;
  available_players: [string, AvailablePlayerConfig][];
  service_fee_percentage: string;
  max_game_duration: string;
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

  getMakeAvailableAction(
    deposit: number | string,
    referrer_id?: string,
    opponent_id?: string
  ): Action {
    return {
      type: "FunctionCall",
      params: {
        methodName: "make_available",
        args: {
          game_config:
            referrer_id && opponent_id
              ? { referrer_id, opponent_id }
              : referrer_id
              ? { referrer_id }
              : opponent_id
              ? { opponent_id }
              : {},
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

  /**
   *
   * @returns An array with the available players. On each element of the array you can find
   * two elements: the first one contains the player's account id. The second one, contains
   * information about the challenge
   */
  get_active_games(): Promise<any[]> {
    return this.wallet.view(this.contractId, "get_active_games", {});
  }

  get_available_players(): Promise<[string, AvailablePlayerConfig][]> {
    return this.wallet.view(this.contractId, "get_available_players", {});
  }

  get_contract_params(): Promise<ContractParams> {
    return this.wallet.view(this.contractId, "get_contract_params", {});
  }

  make_move(
    game_id: number,
    row: number,
    col: number
  ): Promise<FinalExecutionOutcome> {
    return this.wallet.call(
      this.contractId,
      "make_move",
      { game_id, row, col },
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

  stop_game(game_id: number): Promise<FinalExecutionOutcome> {
    return this.wallet.call(
      this.contractId,
      "stop_game",
      { game_id },
      undefined,
      "0"
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
}
