import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Img,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import paletteIcon from "../../../assets/palette-icon.svg";
import checkersIcon from "../../../assets/checkers-icon.svg";
import gamepadIcon from "../../../assets/gamepad-icon.svg";
import cheddarIcon from "../../../assets/cheddar-icon.svg";

export default function GamesMenu() {
  return (
    <Menu>
      <MenuButton
        bgColor="white"
        border="1px solid #3334"
        as={Button}
        borderRadius="full"
        rightIcon={<ChevronDownIcon />}
      >
        Games
      </MenuButton>
      <MenuList minWidth="auto">
        <MenuItem
          as={Link}
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
        </MenuItem>
        <MenuItem
          as={Link}
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
        </MenuItem>
        <MenuItem
          as={Link}
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
        </MenuItem>
        <MenuItem
          as={Link}
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
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
