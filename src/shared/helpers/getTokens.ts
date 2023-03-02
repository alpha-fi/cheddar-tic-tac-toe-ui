import { ENV, getEnv } from "../../near/config";

export interface WhiteListedTokens {
  name: string;
  contractId: string;
  value: string;
  minDeposit: string;
}

export const getTokens = () => {
  return getEnv(ENV).nearEnv.tokensData
};
