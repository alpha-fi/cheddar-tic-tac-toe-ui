import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react";
import { ButtonConnectWallet } from "../components/ButtonConnectWallet";

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
        p={2}
        maxW="container.xxl"
        justifyContent="space-between"
      >
        <Flex align="center" minW="320px">
          <Heading as="h1" size="md" letterSpacing="tighter">
            Cheddar tic-tac-toe
          </Heading>
        </Flex>

        <Stack
          direction={{ base: "column", md: "row" }}
          display={{ base: "none", xl: "flex" }}
          width={{ base: "full", md: "auto" }}
          alignItems="center"
          justifyContent="center"
          flexGrow={1}
          mt={{ base: 4, md: 0 }}
          fontWeight="700"
          lineHeight="1"
        >
          <Link
            href="https://app.cheddar.farm/"
            px="12px"
            target="_blank"
            _focus={{ boxShadow: "0" }}
          >
            Cheddar
          </Link>
        </Stack>

        <Flex minW="320px" flexDir="row" justifyContent="end">
          <ButtonConnectWallet />

          <Box ml={2} display={{ base: "inline-block", xl: "none" }}>
            <Menu isLazy id="navbar-menu">
              <MenuButton
                as={IconButton}
                icon={<HamburgerIcon />}
                variant="outline"
                aria-label="Options"
              />
              <MenuList>
                <Link
                  href="https://app.cheddar.farm/"
                  target="_blank"
                  _hover={{ textDecoration: "none" }}
                >
                  <MenuItem>Cheddar</MenuItem>
                </Link>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
