import { useQuery } from "react-query";
import { useWalletSelector } from "../contexts/WalletSelectorContext";

export const useContractParams = () => {
  const walletSelector = useWalletSelector();
  return useQuery(
    ["availbleGames"],
    () => walletSelector.tictactoeContract?.get_contract_params(),
    {
      refetchInterval: 10000,
      cacheTime: 0,
      notifyOnChangePropsExclusions: ["isStale", "isRefetching", "isFetching"],
    }
  );
};
