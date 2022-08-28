import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Text,
} from "@chakra-ui/react";
import { utils } from "near-api-js";
import { useEffect, useState } from "react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { GameParams } from "../../../hooks/useContractParams";
import { CircleIcon } from "../../../shared/components/CircleIcon";
import { CrossIcon } from "../../../shared/components/CrossIcon";
import { PurpleButton } from "../../../shared/components/PurpleButton";
import {
  GameParamsState,
  initialActiveGameParamsState,
} from "../containers/TicTacToe";

type Props = {
  data: GameParams | undefined;
  activeGameParams: GameParamsState;
  setActiveGameParams: React.Dispatch<React.SetStateAction<GameParamsState>>;
};

export function ActiveGame({
  data,
  activeGameParams,
  setActiveGameParams,
}: Props) {
  const [timeLeft, settimeLeft] = useState<number | undefined>();
  const walletSelector = useWalletSelector();

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

  const handleCloseGame = () => {
    setActiveGameParams(initialActiveGameParamsState);
  };

  console.log(data?.active_game);
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
    <AccordionItem bg="#fffc" borderRadius="8px 8px 0 0">
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="center">
            <Text as="h2" textAlign="center" fontSize="1.1em" fontWeight="700">
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
        {data && !data.active_game && (
          <Flex flexDirection="column" alignItems="start">
            {activeGameParams.winnerId && (
              <Text>
                {activeGameParams.winnerId !== walletSelector.accountId
                  ? `${activeGameParams.winnerId} Win!`
                  : "You Win!"}
              </Text>
            )}
            {!activeGameParams.winnerId && <Text>Game Over!</Text>}
            <Text>{activeGameParams.winningAction}</Text>

            {activeGameParams.winnerReward &&
              activeGameParams.winnerId !== walletSelector.accountId && (
                <Text>
                  Total Reward:{" "}
                  {utils.format.formatNearAmount(activeGameParams.winnerReward)}{" "}
                  {activeGameParams.rewardTokenId}
                </Text>
              )}
            <Button
              size="sm"
              colorScheme="red"
              borderRadius="full"
              onClick={handleCloseGame}
            >
              Close
            </Button>
          </Flex>
        )}
        {data && data.active_game && (
          <>
            <Flex alignItems="center">
              <Text>Current: </Text>
              {data.active_game[1].current_player.piece === "O" ? (
                <CircleIcon
                  w="26px"
                  h="26px"
                  p="3px"
                  borderRadius="4px"
                  mx="5px"
                  bg="#0009"
                  color="yellowCheddar"
                />
              ) : (
                <CrossIcon
                  w="26px"
                  h="26px"
                  p="3px"
                  borderRadius="4px"
                  mx="5px"
                  bg="#0009"
                  color="yellowCheddar"
                />
              )}
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
          </>
        )}
      </AccordionPanel>
    </AccordionItem>
  );
}
