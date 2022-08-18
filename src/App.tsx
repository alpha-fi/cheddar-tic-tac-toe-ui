import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Main from "./components/Main/Main";
import { WalletSelectorContextProvider } from "./contexts/WalletSelectorContext";

const queryClient = new QueryClient();

function App() {
  return (
    <ChakraProvider resetCSS>
      <WalletSelectorContextProvider>
        <QueryClientProvider client={queryClient}>
          <Main />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </WalletSelectorContextProvider>
    </ChakraProvider>
  );
}

export default App;
