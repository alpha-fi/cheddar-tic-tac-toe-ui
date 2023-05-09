import { Button, Menu, MenuButton } from "@chakra-ui/react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";

type Props = {
  cheddarBalance: null | number;
};

export function CheddarBalance({ cheddarBalance }: Props) {
  const walletSelector = useWalletSelector();

  return (
    <>
      {walletSelector.selector.isSignedIn() && (
        <Menu>
          <MenuButton
            colorScheme="yellow"
            bgColor="yellowCheddar"
            border="1px solid #3334"
            as={Button}
            borderRadius="full"
          >
            Cheddar Balance: {cheddarBalance ?? 0}
          </MenuButton>
        </Menu>
      )}
    </>
  );
}
