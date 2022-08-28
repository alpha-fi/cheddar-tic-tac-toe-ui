import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Img,
  Text,
} from "@chakra-ui/react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { useContractParams } from "../../../hooks/useContractParams";
import WaitingList from "./WaitingList";
import WaitingListForm from "./WaitingListForm";
import mouseIcon from "../../../assets/mouse-icon.svg";
import cheddarIcon from "../../../assets/cheddar-icon.svg";
import { utils } from "near-api-js";
import { PurpleButton } from "../../../shared/components/PurpleButton";
import { useEffect, useState } from "react";

export default function Info() {
  const [timeLeft, settimeLeft] = useState<number | undefined>();
  const walletSelector = useWalletSelector();
  const { data } = useContractParams();

  const handleGiveUp = () => {
    if (data?.active_game?.[0]) {
      walletSelector.ticTacToeLogic?.giveUp(parseInt(data.active_game[0]));
    }
  };

  const handleStopGame = () => {
    if (data?.active_game?.[0]) {
      walletSelector.ticTacToeLogic?.stopGame(parseInt(data.active_game[0]));
    }
  };

  useEffect(() => {
    let clearTimer: any;
    let secondsToEnd: number;
    if (data?.max_game_duration && data?.active_game) {
      if (data.active_game[1].last_turn_timestamp_sec === 0) {
        secondsToEnd =
          Math.round(Date.now() / 1000) - data.active_game[1].initiated_at_sec;
      } else {
        secondsToEnd =
          Math.round(Date.now() / 1000) -
          data.active_game[1].last_turn_timestamp_sec;
      }
      const maxDuration = parseInt(data.max_game_duration);
      clearTimer = setTimeout(
        () =>
          settimeLeft(
            secondsToEnd > maxDuration / 9 ? 0 : maxDuration / 9 - secondsToEnd
          ),
        1000
      );
    }
    return () => clearTimeout(clearTimer);
  });

  return (
    <Accordion defaultIndex={[0]}>
      {!data?.active_game && <WaitingList />}
      {walletSelector.selector.isSignedIn() &&
        !data?.active_game &&
        data?.available_players &&
        data.available_players.filter(
          (player) => player[0] === walletSelector.accountId
        ).length === 0 && <WaitingListForm />}
      {data?.active_game && (
        <AccordionItem bg="#fffc" borderRadius="8px 8px 0 0">
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="center">
                <Text
                  as="h2"
                  textAlign="center"
                  fontSize="1.1em"
                  fontWeight="700"
                >
                  Actual Game
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel
            pb={4}
            bg="#eee"
            borderRadius="8px"
            justifyContent="space-between"
            alignItems="center"
            m="12px 16px"
          >
            <Flex>
              <Text>Current: </Text>
              <Box minW="30px" ml="10px">
                <Img
                  src={
                    data.active_game[1].current_player.piece === "O"
                      ? cheddarIcon
                      : mouseIcon
                  }
                  alt=""
                  width="24px"
                  height="24px"
                />
              </Box>
              <Text>
                {data.active_game[1].current_player.account_id ===
                walletSelector.accountId
                  ? "You"
                  : data.active_game[1].current_player.account_id}
              </Text>
            </Flex>
            <Text>
              Game Started at:{" "}
              {
                new Date(data.active_game[1].initiated_at_sec * 1000)
                  .toString()
                  .split(" ")[4]
              }
            </Text>
            <Text>
              Reward:{" "}
              {utils.format.formatNearAmount(
                data.active_game[1].reward.balance
              )}{" "}
              {data.active_game[1].reward.token_id}
            </Text>
            {data.active_game[1].current_player.account_id ===
              walletSelector.accountId && (
              <Text>Turn Seconds Left: {timeLeft}</Text>
            )}
            <Flex gap={3}>
              {data.active_game[1].current_player.account_id ===
                walletSelector.accountId && (
                <PurpleButton size="sm" onClick={handleGiveUp}>
                  Give Up
                </PurpleButton>
              )}
              {data.max_game_duration &&
                data.active_game[1].current_player.account_id !==
                  walletSelector.accountId &&
                Math.round(Date.now() / 1000) -
                  data.active_game[1].initiated_at_sec >
                  parseInt(data.max_game_duration) && (
                  <Button
                    size="sm"
                    colorScheme="red"
                    borderRadius="full"
                    onClick={handleStopGame}
                  >
                    Reclaim Game
                  </Button>
                )}
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      )}

      <AccordionItem bg="#fffc" borderRadius="0 0 8px 8px">
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="center">
              <Text
                as="h2"
                textAlign="center"
                fontSize="1.1em"
                fontWeight="700"
              >
                How to Play / Rules
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel
          pb={4}
          bg="#eee"
          borderRadius="8px"
          justifyContent="space-between"
          alignItems="center"
          m="12px 16px"
        >
          How to play: There is a 3 by 3 grid. One player will be{" "}
          <Img
            mb="-6px"
            display="inline"
            src={mouseIcon}
            alt=""
            width="24px"
            height="24px"
          />{" "}
          and the other{" "}
          <Img
            mb="-6px"
            display="inline"
            src={cheddarIcon}
            alt=""
            width="24px"
            height="24px"
          />
          . You will take turns to put your marks. The first player to get 3 of
          their marks in a row (vertical, horizontal or diagonally) is the
          winner. When all 9 squares are full, the game is over. If no player
          has 3 markes in a row, the game ends in a tie
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
