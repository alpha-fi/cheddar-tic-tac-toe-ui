import {
  Action,
  FinalExecutionOutcome,
  Transaction,
  Wallet,
} from "@near-wallet-selector/core";
import {
  ContractParams,
  Coords,
  GameConfigView,
  GameId,
  Piece,
} from "../../hooks/useContractParams";
import { NEP141, StorageBalance } from "../contracts/NEP141";
import {
  FinalizedGame,
  Stats,
  TicTacToeContract,
} from "../contracts/TicTacToe";

/**
 * This class is thought to get all the necessary data from backend, and to process it so the front end has it easy
 */
export class TicTacToeLogic {
  ticTacToeContract: TicTacToeContract;
  cheddarContract: NEP141;
  actualWallet: Promise<Wallet>;

  constructor(ticTacToeContract: TicTacToeContract, cheddarContract: NEP141) {
    this.ticTacToeContract = ticTacToeContract;
    this.cheddarContract = cheddarContract;
    this.actualWallet = this.cheddarContract.wallet.walletSelector.wallet();
  }

  getAvailableGames(): Promise<[string, GameConfigView][]> {
    return this.ticTacToeContract.get_available_players();
  }

  getAccountBalance(accountId: string): Promise<string> {
    return this.ticTacToeContract.get_account_balance(accountId);
  }

  getContractParams(): Promise<ContractParams> {
    return this.ticTacToeContract.get_contract_params();
  }

  getTokenMinDeposit(accountId: string): Promise<string> {
    return this.ticTacToeContract.get_token_min_deposit(accountId);
  }

  getDisplayableAccountId(screenWidth: number): string {
    return this.ticTacToeContract.getDisplayableAccountId(screenWidth);
  }

  getLastGames(): Promise<[number, FinalizedGame][]> {
    return this.ticTacToeContract.get_last_games();
  }

  getPlayerStats(): Promise<Stats> {
    return this.ticTacToeContract.get_stats();
  }

  getLastMove(
    gameId: GameId
  ): Promise<[Coords | null, Piece, any, number | null]> {
    return this.ticTacToeContract.get_last_move(gameId);
  }

  private async getBetActions(
    amount: number | string,
    availableFor?: number,
    referrerId?: string,
    opponentId?: string
  ): Promise<{ ticTacToeActions: Action[] }> {
    const ticTacToeActions: Action[] = [];
    ticTacToeActions.push(
      this.ticTacToeContract.getMakeAvailableAction(
        amount,
        availableFor,
        referrerId,
        opponentId
      )
    );
    return { ticTacToeActions };
  }

  async bet(
    amount: number,
    availableFor: number,
    referrerId?: string,
    opponentId?: string
  ): Promise<any> {
    const wallet: Wallet = await this.actualWallet;
    const { ticTacToeActions } = await this.getBetActions(
      amount,
      availableFor,
      referrerId,
      opponentId
    );
    const transactions: Transaction[] = [];
    if (ticTacToeActions.length > 0) {
      transactions.push(
        this.generateTransaction(
          this.ticTacToeContract.contractId,
          ticTacToeActions
        )
      );
    }
    console.log(transactions);
    wallet.signAndSendTransactions({ transactions });
  }

  async removeBet(): Promise<any> {
    return this.ticTacToeContract.make_unavailable();
  }

  /**
   * This method won't validate if it's a valid move. It should be done first on the frontend
   * @param gameId Current game
   * @param row
   * @param column
   */
  play(
    gameId: number,
    row: number,
    column: number
  ): Promise<FinalExecutionOutcome> {
    return this.ticTacToeContract.make_move(gameId, row, column);
  }

  giveUp(gameId: number): Promise<any> {
    return this.ticTacToeContract.give_up(gameId);
  }

  async acceptChallenge(
    challenge: [string, GameConfigView],
    referrerId?: string
  ): Promise<void> {
    let ticTacToeActions1: Action[] = [];
    let ticTacToeActions2: Action[] = [];
    const wallet: Wallet = await this.actualWallet;
    const transactions: Transaction[] = [];

    // If user has a pending bet, it removes it. Else keeps with flow.
    const availableGames = await this.getAvailableGames();
    const isUserWaiting = availableGames.some(
      (game: [string, GameConfigView]) =>
        game[0] === this.cheddarContract.wallet.getAccountId()
    );
    if (isUserWaiting) {
      ticTacToeActions1.push(this.ticTacToeContract.getMakeUnavailableAction());
    }

    // Here user shouldn't have any bet, so it creates a bet that matches the desired game.
    const { ticTacToeActions: ticTacToeBetActions } = await this.getBetActions(
      +challenge[1].deposit,
      100,
      referrerId
    );

    if (ticTacToeBetActions.length > 0)
      ticTacToeActions2 = ticTacToeActions2.concat(ticTacToeBetActions);
    console.log("Bet", ticTacToeBetActions);

    // Accept challenge
    ticTacToeActions2.push(
      this.ticTacToeContract.getStartGameAction(challenge[0])
    );

    // Create transactions
    if (ticTacToeActions1.length > 0) {
      transactions.push(
        this.generateTransaction(
          this.ticTacToeContract.contractId,
          ticTacToeActions1
        )
      );
    }

    transactions.push(
      this.generateTransaction(
        this.ticTacToeContract.contractId,
        ticTacToeActions2
      )
    );

    // Call transactions
    wallet.signAndSendTransactions({ transactions });
  }

  claimTimeoutWin(gameId: number): Promise<FinalExecutionOutcome> {
    return this.ticTacToeContract.claim_timeout_win(gameId);
  }

  isUserRegistered(accountId: string): Promise<Boolean> {
    return this.ticTacToeContract.is_user_registered(accountId);
  }

  unregisterAccount(): Promise<any> {
    return this.ticTacToeContract.unregister_account();
  }

  registerAccount(): Promise<any> {
    return this.ticTacToeContract.storage_deposit();
  }

  async depositCheddar(amount: number): Promise<any> {
    const wallet: Wallet = await this.actualWallet;
    let cheddarActions: Action[] = [];
    const transactions: Transaction[] = [];
    const storageDepositAction: Action | null =
      await this.handleCheddarStorage();
    const ftTransferCallAction: Action =
      this.cheddarContract.getFtTransferCallAction(
        this.ticTacToeContract.contractId,
        amount
      );
    if (storageDepositAction) {
      cheddarActions.push(storageDepositAction);
    }
    cheddarActions.push(ftTransferCallAction);
    if (cheddarActions.length > 0)
      transactions.push(
        this.generateTransaction(
          this.cheddarContract.contractId,
          cheddarActions
        )
      );
    wallet.signAndSendTransactions({ transactions });
  }

  async withdrawCheddar(amount: number): Promise<any> {
    return this.ticTacToeContract.withdraw_cheddar(amount);
  }
  private generateTransaction(
    contractId: string,
    actions: Action[]
  ): Transaction {
    return {
      signerId: this.cheddarContract.wallet.getAccountId(),
      receiverId: contractId,
      actions,
    };
  }

  private async handleCheddarStorage(): Promise<Action | null> {
    const storage: StorageBalance | null =
      await this.cheddarContract.storage_balance_of();
    if (!storage) {
      return this.cheddarContract.getStorageDepositAction(0.5);
    }
    return null;
  }
}
