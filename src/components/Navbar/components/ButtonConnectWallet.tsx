import { CheckIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Button, HStack, Menu, MenuButton, MenuList, Text, Tooltip, VStack } from "@chakra-ui/react";
import { utils } from "near-api-js";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { useGetIsUserRegistered } from "../../../hooks/useGetIsUserRegistered";
import { useGetUserCheddarBalances } from "../../../hooks/useGetUserCheddarBalances";
import useScreenSize from "../../../hooks/useScreenSize";
import { CrossIcon } from "../../../shared/components/CrossIcon";
import { YellowButton } from "../../../shared/components/YellowButton";

export function ButtonConnectWallet() {
  const walletSelector = useWalletSelector();
  const { data: isUserRegisteredData = false} = useGetIsUserRegistered()
  const { width } = useScreenSize();
  const { data: userCheddarBalancesData } = useGetUserCheddarBalances()


  const handleOnClick = async () => {
    if (walletSelector.selector.isSignedIn() && walletSelector.wallet) {
      walletSelector.wallet.signOut();
    } else {
      walletSelector.modal.show();
    }
  };
  const userType = isUserRegisteredData ? "" : "not";
  const label = `You are ${userType} registered`;
  return (
    <>
      {walletSelector.selector.isSignedIn() ? (
        <Menu>
          <Tooltip label={label}>
            <MenuButton
              colorScheme="yellow"
              bgColor="yellowCheddar"
              border="1px solid #3334"
              as={Button}
              borderRadius="full"
              rightIcon={<ChevronDownIcon />}
            >
              <HStack>
                <Box>
                  {isUserRegisteredData ?
                    <CheckIcon color="green" w="20px" h="20px"/>
                  : 
                    <CrossIcon color="red" w="20px" h="20px"/>
                  }
                </Box>
              <VStack spacing="2px" alignItems="start">
                <Text lineHeight="1">
                  {walletSelector.ticTacToeLogic?.getDisplayableAccountId(width)}
                </Text>
                <Text lineHeight="1" fontSize="12px" color={isUserRegisteredData ? "green" : "red" }>
                  {isUserRegisteredData ? "REGISTERED" : "UNREGISTERED"}  
                </Text>
              </VStack>
              </HStack>
            </MenuButton>
          </Tooltip>
          <MenuList
            minWidth="auto"
            borderRadius="8px"
            bg="#fff"
            p="16px"
          >
            <VStack spacing="8px" bg="#eee" p="16px" borderRadius="8px">
              <HStack justifyContent="space-between" spacing="24px" w="100%">
                <Text>Deposited Cheddar:</Text>
                <Text>{`${userCheddarBalancesData?.gameBalance}`}</Text>
              </HStack>
              <HStack justifyContent="space-between" spacing="24px" w="100%">
                <Text>NEAR account Cheddar:</Text>
                <Text>{`${utils.format.formatNearAmount(userCheddarBalancesData?.walletBalance||"0")}`}</Text>
              </HStack>
              <Button
                onClick={handleOnClick}
                colorScheme="yellow"
                borderRadius="full"
                bg="yellowCheddar"
                _focus={{
                  boxShadow: "0 0 0 0 #0000",
                }}
                w="100%"
              >
                Disconnect
              </Button>
            </VStack>
          </MenuList>
        </Menu>
      ) : (
        <YellowButton onClick={handleOnClick}>Connect</YellowButton>
      )}
    </>
  );
}
