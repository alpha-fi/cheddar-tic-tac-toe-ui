import { SelectorWallet } from "../wallet/wallet-selector";

export class NEP141 {

    constructor(public wallet: SelectorWallet, public contractId: string) {}

    ft_balance_of(): Promise<string> {
        return this.wallet.view(this.contractId, "ft_balance_of", {account_id: this.wallet.getAccountId()})
    }

    ft_transfer_call(receiver_id: string, amount: string, msg?: string): Promise<string> {
        return this.wallet.call(this.contractId, "ft_transfer_call", {receiver_id, amount, msg: msg || ""})
    }

    storage_balance_of(): Promise<string> {
        return this.wallet.view(this.contractId, "storage_balance_of", {account_id: this.wallet.getAccountId()})
    }

    storage_deposit(deposit: string): Promise<string> {
        return this.wallet.call(this.contractId, "storage_deposit", {}, undefined, deposit)
    }


}