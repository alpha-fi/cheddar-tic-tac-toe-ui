import {
  Box,
  Container,
  Flex,
  Heading,
  Img,
  Link,
  Stack,
} from "@chakra-ui/react";
import { WhiteButton } from "../../../shared/components/WhiteButton";
import { ButtonConnectWallet } from "../components/ButtonConnectWallet";
import thunderIcon from "../../../assets/thunder-icon.svg";
import swapIcon from "../../../assets/swap-icon.svg";
import telegramIcon from "../../../assets/telegram.svg";
import discordIcon from "../../../assets/discord.svg";
import twitterIcon from "../../../assets/twitter.svg";
import gitbookIcon from "../../../assets/gitbook.svg";
import GamesMenu from "../components/GamesMenu";
import { DrawerMenu } from "../components/DrawerMenu";

export default function Navbar() {
  return (
    <Box
      position="relative"
      as="nav"
      w="100%"
      h="60px"
      bg="#3331"
      css={{ backdropFilter: "blur(2px)" }}
      zIndex={1}
    >
      <Container
        display="flex"
        alignContent="center"
        maxW="container.xxl"
        justifyContent="space-between"
        alignItems="center"
        px="30px"
        height="100%"
      >
        <Flex columnGap={2} alignContent="center">
          <Flex flexDirection="column" rowGap={1} mr="20px">
            <Heading
              as="h1"
              size="md"
              mr="10px"
              alignSelf="center"
              letterSpacing="tighter"
            >
              Cheddar TicTacToe
            </Heading>
            <Flex
              justifyContent="center"
              display={{ base: "none", lg: "flex" }}
            >
              <Link
                href="https://t.me/cheddarfarm"
                target="_blank"
                _active={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
                _focus={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
                minW="24px"
              >
                <Img src={telegramIcon} alt="" width="16px" height="16px" />
              </Link>
              <Link
                href="https://discord.com/invite/G9PTbmPUwe"
                target="_blank"
                _active={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
                _focus={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
                minW="24px"
              >
                <Img src={discordIcon} alt="" width="16px" height="16px" />
              </Link>
              <Link
                href="https://twitter.com/CheddarFi"
                target="_blank"
                _active={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
                _focus={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
                minW="24px"
              >
                <Img src={twitterIcon} alt="" width="16px" height="16px" />
              </Link>
              <Link
                href="https://cheddarfarm.gitbook.io/docs"
                target="_blank"
                _active={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
                _focus={{ textDecoration: "none", boxShadow: "0 0 0 0 #0000" }}
                minW="24px"
              >
                <Img src={gitbookIcon} alt="" width="16px" height="16px" />
              </Link>
            </Flex>
          </Flex>

          <Stack
            direction={{ base: "column", md: "row" }}
            display={{ base: "none", lg: "flex" }}
            width={{ base: "full", md: "auto" }}
            alignItems="center"
            justifyContent="center"
            flexGrow={1}
            mt={{ base: 4, md: 0 }}
            fontWeight="700"
            lineHeight="1"
          >
            <GamesMenu />
            <Link
              href="https://nft.cheddar.farm/"
              target="_blank"
              _focus={{ boxShadow: "0 0 0 0" }}
              _hover={{ textDecoration: "none" }}
            >
              <WhiteButton>
                <Box minW="30px">
                  <Img src={thunderIcon} alt="" width="24px" height="24px" />
                </Box>
                NFT
              </WhiteButton>
            </Link>
            <Link
              href="https://app.ref.finance/#token.cheddar.near|token.v2.ref-finance.near"
              target="_blank"
              _focus={{ boxShadow: "0 0 0 0" }}
              _hover={{ textDecoration: "none" }}
            >
              <WhiteButton>
                <Box minW="30px">
                  <Img
                    bg="#6495ed70"
                    border="#6495ed70 2px solid"
                    padding="1px"
                    borderRadius="full"
                    src={swapIcon}
                    alt=""
                    width="24px"
                    height="24px"
                  />
                </Box>
                Swap
              </WhiteButton>
            </Link>
          </Stack>
        </Flex>

        <Flex flexDir="row" justifyContent="end">
          <ButtonConnectWallet />
          <Box ml={2} display={{ base: "inline-block", lg: "none" }}>
            <DrawerMenu />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
