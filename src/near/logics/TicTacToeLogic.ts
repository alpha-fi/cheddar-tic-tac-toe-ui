import { Action, Transaction, Wallet } from "@near-wallet-selector/core";
import { NEP141, StorageBalance } from "../contracts/NEP141";
import { AvailablePlayerConfig, TicTacToeContract } from "../contracts/TicTacToe";

/**
 * This class is thought to get all the necessary data from backend, and to process it so the front end has it easy
 */
export class TicTacToeLogic {

    ticTacToeContract: TicTacToeContract
    cheddarContract: NEP141
    actualWallet: Promise<Wallet>

    constructor(ticTacToeContract: TicTacToeContract, cheddarContract: NEP141) {
        this.ticTacToeContract = ticTacToeContract
        this.cheddarContract = cheddarContract
        this.actualWallet = this.cheddarContract.wallet.walletSelector.wallet()
    }

    getAvailableGames(): Promise<[string, AvailablePlayerConfig][]> {
        return this.ticTacToeContract.get_available_players()
    }

    private async getBetActions(amount: number|string, withCheddar?: boolean, referrerId?: string): Promise<{cheddarActions: Action[], ticTacToeActions: Action[]}> {
        const cheddarActions: Action[] = []
        const ticTacToeActions: Action[] = []

        if(withCheddar) {
            const storageDepositAction: Action|null = await this.handleCheddarStorage()
            const ftTransferCallAction: Action = this.cheddarContract.getFtTransferCallAction(
                this.ticTacToeContract.contractId,
                amount,
                referrerId ? `{"referrer_id":'${referrerId}'}` : ""
            )
            if(storageDepositAction) {
                cheddarActions.push(storageDepositAction)
            }
            cheddarActions.push(ftTransferCallAction)
            console.log(cheddarActions)
            ticTacToeActions.push(this.ticTacToeContract.getMakeAvailableAction("1"))
        } else {
            ticTacToeActions.push(this.ticTacToeContract.getMakeAvailableAction(amount))
        }
        return {cheddarActions, ticTacToeActions}
    }

    async bet(amount: number, withCheddar?: boolean, referrerId?: string): Promise<any> {
        const wallet: Wallet = await this.actualWallet
        const { cheddarActions, ticTacToeActions} = await this.getBetActions(amount, withCheddar, referrerId)
        const transactions: Transaction[] = []
        if(cheddarActions.length > 0) transactions.push(this.generateTransaction(this.cheddarContract.contractId, cheddarActions))
        transactions.push(this.generateTransaction(this.ticTacToeContract.contractId, ticTacToeActions))
        wallet.signAndSendTransactions({transactions})
    }

    /**
     * This method won't validate if it's a valid move. It should be done first on the frontend
     * @param gameId Current game
     * @param row 
     * @param column 
     */
    play(gameId: number, row: number, column: number): void {
        this.ticTacToeContract.make_move(gameId, row, column)
    }

    giveUp(gameId: number): Promise<any> {
        return this.ticTacToeContract.give_up(gameId)
    }

    async acceptChallenge(challenge: [string, AvailablePlayerConfig], referrerId?: string): Promise<void> {
        let cheddarActions: Action[] = []
        let ticTacToeActions: Action[] = []
        const wallet: Wallet = await this.actualWallet
        const transactions: Transaction[] = []

        // If user has a pending bet, it removes it. Else keeps with flow.
        const availableGames = await this.getAvailableGames()
        const isUserWaiting = availableGames.some((game: [string, AvailablePlayerConfig]) => game[0] === this.cheddarContract.wallet.getAccountId())
        if(isUserWaiting) {
            ticTacToeActions.push(this.ticTacToeContract.getMakeUnavailableAction())
        }

        // Here user shouldn't have any bet, so it creates a bet that matches the desired game.
        const { cheddarActions: cheddarBetActions, ticTacToeActions: ticTacToeBetActions} = await this.getBetActions(challenge[1].deposit, challenge[1].token_id !== "near", referrerId)
        if(cheddarBetActions.length > 0) cheddarActions = cheddarActions.concat(cheddarBetActions)
        ticTacToeActions = ticTacToeActions.concat(ticTacToeBetActions)
        console.log("Bet", cheddarBetActions, ticTacToeBetActions)

        
        // Accept challenge
        ticTacToeActions.push(this.ticTacToeContract.getStartGameAction(challenge[0]))

        // Create transactions
        if(cheddarBetActions.length > 0) transactions.push(this.generateTransaction(this.cheddarContract.contractId, cheddarActions))
        transactions.push(this.generateTransaction(this.ticTacToeContract.contractId, ticTacToeActions))

        // Call transactions
        wallet.signAndSendTransactions({transactions})
        
    }

    private generateTransaction(contractId: string, actions: Action[]): Transaction {
        return {
            signerId: this.cheddarContract.wallet.getAccountId(),
            receiverId: contractId,
            actions
        }
    }

    private async handleCheddarStorage(): Promise<Action|null> {
        const storage: StorageBalance|null = await this.cheddarContract.storage_balance_of()
        if(!storage) {
            return this.cheddarContract.getStorageDepositAction(0.5)
        }
        return null
    }


}