import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Img,
  Link,
  useDisclosure,
} from "@chakra-ui/react";
import paletteIcon from "../../../assets/palette-icon.svg";
import checkersIcon from "../../../assets/checkers-icon.svg";
import gamepadIcon from "../../../assets/gamepad-icon.svg";
import cheddarIcon from "../../../assets/cheddar-icon.svg";
import thunderIcon from "../../../assets/thunder-icon.svg";
import swapIcon from "../../../assets/swap-icon.svg";
import telegramIcon from "../../../assets/telegram.svg";
import discordIcon from "../../../assets/discord.svg";
import twitterIcon from "../../../assets/twitter.svg";
import gitbookIcon from "../../../assets/gitbook.svg";

export function DrawerMenu() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <IconButton
        icon={<HamburgerIcon />}
        onClick={onOpen}
        aria-label="Menu"
        border="1px solid #3334"
        colorScheme="yellow"
        bg="white"
        _hover={{ bg: "yellowCheddar" }}
      />
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton
            _active={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
            _focus={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
          />
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>

          <DrawerBody px="0">
            <Box mt="20px">
              <Link
                p="16px 24px"
                display="flex"
                href="https://nft.cheddar.farm/"
                target="_blank"
                _hover={{ bg: "yellowCheddar" }}
                _active={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
                _focus={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
              >
                <Box minW="30px">
                  <Img src={thunderIcon} alt="" width="24px" height="24px" />
                </Box>
                NFT
              </Link>
              <Link
                p="16px 24px"
                display="flex"
                href="https://app.ref.finance/#token.cheddar.near|token.v2.ref-finance.near"
                target="_blank"
                _hover={{ bg: "yellowCheddar" }}
                _active={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
                _focus={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
              >
                <Box minW="30px">
                  <Img src={swapIcon} alt="" width="24px" height="24px" />
                </Box>
                Swap
              </Link>
              <Link
                p="16px 24px"
                display="flex"
                href="https://draw.cheddar.farm"
                target="_blank"
                _hover={{ bg: "yellowCheddar" }}
                _active={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
                _focus={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
              >
                <Box minW="30px">
                  <Img src={paletteIcon} alt="" width="24px" height="24px" />
                </Box>
                Draw
              </Link>
              <Link
                p="16px 24px"
                display="flex"
                href="https://vps179324.iceservers.net/"
                target="_blank"
                _hover={{ bg: "yellowCheddar" }}
                _active={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
                _focus={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
              >
                <Box minW="30px">
                  <Img src={cheddarIcon} alt="" width="24px" height="24px" />
                </Box>
                CoinFlip
              </Link>
              <Link
                p="16px 24px"
                display="flex"
                href="https://checkers.cheddar.farm/"
                target="_blank"
                _hover={{ bg: "yellowCheddar" }}
                _active={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
                _focus={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
              >
                <Box minW="30px">
                  <Img src={checkersIcon} alt="" width="24px" height="24px" />
                </Box>
                Checkers
              </Link>
              <Link
                p="16px 24px"
                display="flex"
                href="https://nearhub.club/cdcUv8P/cheddar-farm"
                target="_blank"
                _hover={{ bg: "yellowCheddar" }}
                _active={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
                _focus={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
              >
                <Box minW="30px">
                  <Img src={gamepadIcon} alt="" width="24px" height="24px" />
                </Box>
                VrFarm
              </Link>
            </Box>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px" justifyContent="space-around">
            <Link
              href="https://t.me/cheddarfarm"
              target="_blank"
              _active={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
              _focus={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
              minW="30px"
            >
              <Img src={telegramIcon} alt="" width="20px" height="20px" />
            </Link>
            <Link
              href="https://discord.com/invite/G9PTbmPUwe"
              target="_blank"
              _active={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
              _focus={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
              minW="30px"
            >
              <Img src={discordIcon} alt="" width="20px" height="20px" />
            </Link>
            <Link
              href="https://twitter.com/CheddarFi"
              target="_blank"
              _active={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
              _focus={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
              minW="30px"
            >
              <Img src={twitterIcon} alt="" width="20px" height="20px" />
            </Link>
            <Link
              href="https://cheddarfarm.gitbook.io/docs"
              target="_blank"
              _active={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
              _focus={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
              minW="30px"
            >
              <Img src={gitbookIcon} alt="" width="20px" height="20px" />
            </Link>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
