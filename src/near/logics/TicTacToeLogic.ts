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

    async bet(amount: number, withCheddar?: boolean, referrerId?: string): Promise<any> {
        const cheddarActions: Action[] = []
        const ticTacToeActions: Action[] = []
        const wallet: Wallet = await this.actualWallet

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

            ticTacToeActions.push(this.ticTacToeContract.getMakeAvailableAction("1"))

            wallet.signAndSendTransactions({
                transactions: [
                    this.generateTransaction(this.cheddarContract.contractId, cheddarActions),
                    this.generateTransaction(this.ticTacToeContract.contractId, ticTacToeActions)
                ]
            })
        } else {
            ticTacToeActions.push(this.ticTacToeContract.getMakeAvailableAction(amount))

            wallet.signAndSendTransactions({
                transactions: [this.generateTransaction(this.ticTacToeContract.contractId, ticTacToeActions)]
            })
        }
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