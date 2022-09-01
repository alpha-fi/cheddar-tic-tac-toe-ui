import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Spinner,
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
  initialActiveGameParamsState2,
} from "../containers/TicTacToe";
import cheddarIcon from "../../../assets/cheddar-icon.svg";
import TokenName from "./TokenName";

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
  const [loadingFinalizedGame, setLoadingFinalizedGame] = useState(false);
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
    setActiveGameParams(initialActiveGameParamsState2);
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

  useEffect(() => {
    if (data && !data.active_game && activeGameParams.game_id) {
      setLoadingFinalizedGame(true);
      walletSelector.ticTacToeLogic
        ?.getLastGames()
        .then((resp) => {
          const game = resp.find(
            (item) => item[0].toString() === activeGameParams.game_id
          );
          if (game) {
            setActiveGameParams((prev) => {
              return {
                ...prev,
                game_result: {
                  result: game[1].game_result === "Tie" ? "Tie" : "Win",
                  winner_id: game[1].game_result.Win ?? "",
                },
                reward_or_tie_refund: game[1].reward_or_tie_refund,
                board: game[1].board,
              };
            });
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingFinalizedGame(false));
    }
  }, [
    activeGameParams.game_id,
    data,
    setActiveGameParams,
    walletSelector.ticTacToeLogic,
  ]);

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
        {loadingFinalizedGame && (
          <Flex h="100%" justifyContent="center" alignItems="center">
            <Spinner
              thickness="0px"
              speed="0.65s"
              size="xl"
              bgImage={cheddarIcon}
            />
          </Flex>
        )}
        {data && !data.active_game && activeGameParams.game_result.result && (
          <Flex flexDirection="column" alignItems="center" rowGap={2}>
            {activeGameParams.game_result.result === "Win" &&
              activeGameParams.game_result.winner_id && (
                <>
                  <Text>
                    {activeGameParams.game_result.winner_id ===
                    walletSelector.accountId
                      ? "You Are The Winner!"
                      : `The Winner is ${activeGameParams.game_result.winner_id}`}
                  </Text>
                  <Text>
                    Reward:{" "}
                    {utils.format.formatNearAmount(
                      activeGameParams.reward_or_tie_refund.balance!
                    )}{" "}
                    {
                      <TokenName
                        tokenId={
                          activeGameParams.reward_or_tie_refund.token_id!
                        }
                      />
                    }
                  </Text>
                </>
              )}
            {activeGameParams.game_result.result === "Tie" && (
              <>
                <Text>Tied Game!</Text>
                <Text>
                  Refund:{" "}
                  {utils.format.formatNearAmount(
                    activeGameParams.reward_or_tie_refund.balance!
                  )}{" "}
                  {
                    <TokenName
                      tokenId={activeGameParams.reward_or_tie_refund.token_id!}
                    />
                  }
                </Text>
              </>
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
          <Flex flexDirection="column" alignItems="center" rowGap={2}>
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
              Total Bet:{" "}
              {utils.format.formatNearAmount(
                data.active_game[1].reward.balance
              )}{" "}
              {<TokenName tokenId={data.active_game[1].reward.token_id} />}
            </Text>
            <Text>
              {data.active_game[1].current_player.account_id ===
              walletSelector.accountId
                ? "Turn "
                : "Opponent "}
              Seconds Left: {timeLeft}
            </Text>
            <Flex gap={3}>
              {data.active_game[1].current_player.account_id ===
                walletSelector.accountId && (
                <PurpleButton size="sm" onClick={handleGiveUp}>
                  Give Up
                </PurpleButton>
              )}
              {timeLeft === 0 &&
                data.active_game[1].current_player.account_id !==
                  walletSelector.accountId && (
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
          </Flex>
        )}
      </AccordionPanel>
    </AccordionItem>
  );
}
