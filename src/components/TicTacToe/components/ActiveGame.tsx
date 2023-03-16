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
import {
  getMaxTurnDuration,
} from "../../../hooks/useContractParams";
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
import { getErrorMessage } from "../../../shared/helpers/getErrorMsg";
import { ErrorModal } from "../../../shared/components/ErrorModal";
import { isNumberValid } from "../../../shared/helpers/common";

type Props = {
  activeGameParams: GameParamsState;
  setActiveGameParams: (value: GameParamsState) => void;
};

export function ActiveGame({ activeGameParams, setActiveGameParams }: Props) {
  const [timeLeft, setTimeLeft] = useState<number | undefined>();
  const [errorMsg, setErrorMsg] = useState("");
  const walletSelector = useWalletSelector();
  const { width } = useScreenSize();
  const [maxTurnDuration, setMaxTurnDuration] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    getMaxTurnDuration(walletSelector).then((resp) => {
      setMaxTurnDuration(resp);
    });
  }, []);

  const handleGiveUp = () => {
    if (isNumberValid(activeGameParams.game_id)) {
      walletSelector.ticTacToeLogic
        ?.giveUp(activeGameParams.game_id as number)
        .catch((error) => {
          console.error(error);
          setErrorMsg(getErrorMessage(error));
        });
    }
  };

  const handleStopGame = () => {
    if (isNumberValid(activeGameParams.game_id)) {
      walletSelector.ticTacToeLogic
        ?.stopGame(activeGameParams.game_id as number)
        .catch((error) => {
          console.error(error);
          setErrorMsg(getErrorMessage(error));
        });
    }
  };

  const handleClaimTimeoutWin = () => {
    if (data?.active_game?.[0]) {
      walletSelector.ticTacToeLogic
        ?.claimTimeoutWin(parseInt(data.active_game[0]))
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
    let updateTimer = true;
    let secondsToEnd: number;
    if (maxTurnDuration) {
      if (activeGameParams.last_turn_timestamp_sec === 0) {
        secondsToEnd =
          Math.round(Date.now() / 1000) -
          (activeGameParams.initiated_at_sec as number);
      } else {
        secondsToEnd =
          Math.round(Date.now() / 1000) -
          (activeGameParams.last_turn_timestamp_sec as number);
      }
      const clearTimer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (secondsToEnd > maxTurnDuration) {
            return 0; // If time has exceeded max duration, set time left to 0
          } else {
            const timeLeft = maxTurnDuration - secondsToEnd;
            console.log(
              timeLeft,
              !prevTimeLeft || updateTimer
                ? timeLeft
                : prevTimeLeft === 0
                ? 0
                : prevTimeLeft - 1
            );
            return !isNumberValid(prevTimeLeft) || updateTimer
              ? timeLeft
              : prevTimeLeft === 0
              ? 0
              : prevTimeLeft! - 1;
          }
        });
        updateTimer = false;
      }, 1000);
      return () => clearInterval(clearTimer);
    }
  }, [
    maxTurnDuration,
    activeGameParams.last_turn_timestamp_sec,
    activeGameParams.initiated_at_sec,
  ]);

  return (
    <>
      <AccordionItem
        bg="#fffc"
        borderRadius={
          isNumberValid(activeGameParams.game_id) ? "8px" : "8px 8px 0 0"
        }
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
            {isNumberValid(activeGameParams.game_id) && <AccordionIcon />}
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
          {activeGameParams?.game_result?.result && (
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
                        activeGameParams.reward.balance!
                      )}{" "}
                      {
                        <TokenName
                          tokenId={activeGameParams.reward.token_id!}
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
                      activeGameParams.reward.balance!
                    )}{" "}
                    {<TokenName tokenId={activeGameParams.reward.token_id!} />}
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
          {isNumberValid(activeGameParams.game_id) && (
            <Flex flexDirection="column" alignItems="center" rowGap={2}>
              <Flex alignItems="center">
                <Text>Current: </Text>
                {activeGameParams.current_player ===
                activeGameParams.player1 ? (
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
                  {activeGameParams.current_player === walletSelector.accountId
                    ? "You"
                    : formatAccountId(
                        activeGameParams.current_player as string,
                        width
                      )}
                </Text>
              </Flex>
              <Text>
                Game Started at:{" "}
                {
                  new Date((activeGameParams.initiated_at_sec as number) * 1000)
                    .toString()
                    .split(" ")[4]
                }
              </Text>
              <Text>
                Total Bet:{" "}
                {utils.format.formatNearAmount(
                  activeGameParams.reward.balance!
                )}{" "}
                {
                  <TokenName
                    tokenId={activeGameParams.reward.token_id as string}
                  />
                }
              </Text>
              <Text>
                {activeGameParams.current_player === walletSelector.accountId
                  ? "Turn "
                  : "Opponent "}
                Seconds Left: {timeLeft}
              </Text>
              <Flex gap={3}>
                {activeGameParams.current_player ===
                  walletSelector.accountId && (
                  <PurpleButton size="sm" onClick={handleGiveUp}>
                    Give Up
                  </PurpleButton>
                )}
                {timeLeft === 0 &&
                  activeGameParams.current_player !==
                    walletSelector.accountId && (
                    <Button
                      size="sm"
                      colorScheme="red"
                      borderRadius="full"
                      onClick={handleClaimTimeoutWin}
                    >
                      Reclaim Game
                    </Button>
                  )}
              </Flex>
            </Flex>
          )}
        </AccordionPanel>
      </AccordionItem>
      <ErrorModal msg={errorMsg} setMsg={setErrorMsg} />
    </>
  );
}
