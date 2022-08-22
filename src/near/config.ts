const MAINNET = "mainnet"
const TESTNET = "testnet"

export const ENV = TESTNET

interface NearEnv {
    networkId: string,
    nodeUrl: string,
    walletUrl: string,
    helperUrl: string,
    headers: Object,
}

interface TicTacToeEnv {
    nearEnv: NearEnv
    contractId: string
    cheddarContractId: string
}

export function getEnv(env: string): TicTacToeEnv {
    switch(env) {
    case MAINNET: 
        return {
            nearEnv: {
                networkId: "mainnet",
                nodeUrl: "https://rpc.mainnet.near.org",
                walletUrl: "https://wallet.near.org",
                helperUrl: "https://helper.mainnet.near.org",
                headers: {},
            },
            contractId: "NOT SET YET",
            cheddarContractId: "NOT SET YET"
        
        }
    case TESTNET:
        return {
            nearEnv: {
                networkId: "testnet",
                nodeUrl: "https://rpc.testnet.near.org",
                walletUrl: "https://wallet.testnet.near.org",
                helperUrl: "https://helper.testnet.near.org",
                headers: {},
            },
            contractId: "tictactoe.cheddar.testnet",
            cheddarContractId: "token-v3.cheddar.testnet"
        }
        default:
            throw new Error(`${env} is not a valid NEAR environment`)
    }

}