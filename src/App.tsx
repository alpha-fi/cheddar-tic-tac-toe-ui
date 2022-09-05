import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Main from "./components/Main/Main";
import { WalletSelectorContextProvider } from "./contexts/WalletSelectorContext";
import { theme } from "./components/lib/theme";
import "@fontsource/titillium-web";

const queryClient = new QueryClient();

function App() {
  return (
    <ChakraProvider theme={theme} resetCSS>
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
