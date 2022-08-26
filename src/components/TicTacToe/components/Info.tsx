import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Img,
  Text,
} from "@chakra-ui/react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { useContractParams } from "../../../hooks/useContractParams";
import { YellowButton } from "../../../shared/components/YellowButton";
import WaitingList from "./WaitingList";
import WaitingListForm from "./WaitingListForm";
import mouseIcon from "../../../assets/mouse-icon.svg";
import cheddarIcon from "../../../assets/cheddar-icon.svg";
import { utils } from "near-api-js";
import { PurpleButton } from "../../../shared/components/PurpleButton";

export default function Info() {
  const walletSelector = useWalletSelector();
  const { data } = useContractParams();
  console.log(data);

  const handleOnClick = async () => {
    if (walletSelector.selector.isSignedIn() && walletSelector.wallet) {
      walletSelector.wallet.signOut();
    } else {
      walletSelector.modal.show();
    }
  };
  const handleGiveUp = () => {
    if (data?.active_game?.[0]) {
      walletSelector.ticTacToeLogic?.giveUp(parseInt(data.active_game[0]));
    }
  };
  return (
    <Accordion defaultIndex={walletSelector.selector.isSignedIn() ? [0] : []}>
      <Box flex="1" p="8px 16px" bg="#fffc" borderRadius="8px 8px 0 0">
        <Flex flexDirection="column">
          <Text as="h2" textAlign="center" fontSize="1.2em" fontWeight="700">
            Cheddar TicTacToe
          </Text>
          {!walletSelector.selector.isSignedIn() && (
            <Flex
              flexDirection="column"
              rowGap={2}
              bg="#eee"
              borderRadius="8px"
              justifyContent="center"
              alignItems="center"
              p="12px 16px"
            >
              <Text>Connect with NEAR account</Text>
              <YellowButton onClick={handleOnClick}>Connect</YellowButton>
            </Flex>
          )}
        </Flex>
      </Box>
      {!data?.active_game && <WaitingList />}
      {walletSelector.selector.isSignedIn() && !data?.active_game && (
        <WaitingListForm />
      )}
      {data?.active_game && (
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
              reward:{" "}
              {utils.format.formatNearAmount(
                data.active_game[1].reward.balance
              )}{" "}
              {data.active_game[1].reward.token_id}
            </Text>
            <Text>initiated at: {data.active_game[1].initiated_at_sec}</Text>
            <Text>
              last turn: {data.active_game[1].last_turn_timestamp_sec}
            </Text>
            <Text>
              current duration: {data.active_game[1].current_duration_sec}
            </Text>
            <PurpleButton onClick={handleGiveUp}>Give Up</PurpleButton>
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
          How to play: Click a checkbox "double jump" on the top of the board
          before every double jump. Shift key makes the same trick. Set a bid
          and join waiting list or select an available player to start the game.
          The winner takes the pot. Invite a friend to get a 10% referral bonus
          from his rewards. Hold shift button (or check a checkbox) to perform a
          double jump. Release a shift button before a final move. If you spent
          more than an hour, your opponent may stop the game and get the reward.
          Service fee is 10%, referral reward is half of the service fee.
          Various game stats are storing onchain. General Game Rules (source)
          Capturing is mandatory. Double capturing is not mandatory. Uncrowned
          pieces (men) move one step diagonally forwards, and capture an
          opponent's piece. Men can jump only forwards. Multiple enemy pieces
          can be captured in a single turn provided this is done by successive
          jumps made by a single piece. Kings acquires additional powers
          including the ability to move backwards and capture backwards.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
