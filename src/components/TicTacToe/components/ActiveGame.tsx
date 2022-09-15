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
  initialActiveGameParamsState,
} from "../containers/TicTacToe";
import cheddarIcon from "../../../assets/cheddar-icon.svg";
import TokenName from "./TokenName";
import useScreenSize from "../../../hooks/useScreenSize";
import { formatAccountId } from "../../../shared/helpers/formatAccountId";
import {
  addSWNotification,
  hasUserPermission,
} from "../../../shared/helpers/notifications";
import { getErrorMessage } from "../../../shared/helpers/getErrorMsg";
import { ErrorModal } from "../../../shared/components/ErrorModal";

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
  const [errorMsg, setErrorMsg] = useState("");
  const walletSelector = useWalletSelector();
  const { width } = useScreenSize();

  const handleGiveUp = () => {
    if (data?.active_game?.[0]) {
      walletSelector.ticTacToeLogic
        ?.giveUp(parseInt(data.active_game[0]))
        .catch((error) => {
          console.error(error);
          setErrorMsg(getErrorMessage(error));
        });
    }
  };

  const handleStopGame = () => {
    if (data?.active_game?.[0]) {
      walletSelector.ticTacToeLogic
        ?.stopGame(parseInt(data.active_game[0]))
        .catch((error) => {
          console.error(error);
          setErrorMsg(getErrorMessage(error));
        });
    }
  };

  const handleCloseGame = () => {
    setActiveGameParams(initialActiveGameParamsState);
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
            const result = game[1].game_result === "Tie" ? "Tie" : "Win";
            const winnerId = game[1].game_result.Win ?? "";
            setActiveGameParams((prev) => {
              return {
                ...prev,
                game_result: {
                  result: result,
                  winner_id: winnerId,
                },
                reward_or_tie_refund: game[1].reward_or_tie_refund,
                board: game[1].board,
              };
            });
            if (hasUserPermission()) {
              let msg;
              if (result === "Tie") {
                msg = "Game Over: Tied Game!";
              } else {
                if (winnerId === walletSelector.accountId) {
                  msg = "Game Over: You Win!";
                } else {
                  msg = "Game Over: You Lose!";
                }
              }
              addSWNotification(msg);
            }
          }
        })
        .catch((error) => {
          console.error(error);
          setErrorMsg(getErrorMessage(error));
        })
        .finally(() => setLoadingFinalizedGame(false));
    }
  }, [
    activeGameParams.game_id,
    data,
    setActiveGameParams,
    walletSelector.ticTacToeLogic,
    walletSelector.accountId,
  ]);

  return (
    <>
      <AccordionItem
        bg="#fffc"
        borderRadius={data?.active_game ? "8px" : "8px 8px 0 0"}
      >
        <h2>
          <AccordionButton _focus={{ boxShadow: "0 0 0 0 #0000" }}>
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
            {!data?.active_game && <AccordionIcon />}
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
                        : `The Winner is 
                      ${formatAccountId(
                        activeGameParams.game_result.winner_id,
                        width
                      )}`}
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
                        tokenId={
                          activeGameParams.reward_or_tie_refund.token_id!
                        }
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
                    : formatAccountId(
                        data.active_game[1].current_player.account_id,
                        width
                      )}
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
                {
                  <Button
                    size="sm"
                    colorScheme="red"
                    borderRadius="full"
                    onClick={handleStopGame}
                  >
                    Reclaim Game
                  </Button>
                }
              </Flex>
            </Flex>
          )}
        </AccordionPanel>
      </AccordionItem>
      <ErrorModal msg={errorMsg} setMsg={setErrorMsg} />
    </>
  );
}
