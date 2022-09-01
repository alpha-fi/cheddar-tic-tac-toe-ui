import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import { utils } from "near-api-js";
import { useEffect, useState } from "react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { GameParams } from "../../../hooks/useContractParams";
import { Stats } from "../../../near/contracts/TicTacToe";
import TokenName from "./TokenName";

type Props = {
  data: GameParams | undefined;
};

export function UserStats({ data }: Props) {
  const [stats, setStats] = useState<Stats>();
  const walletSelector = useWalletSelector();

  useEffect(() => {
    walletSelector.ticTacToeLogic
      ?.getPlayerStats()
      .then((resp) => setStats(resp));
  }, [walletSelector.ticTacToeLogic, data?.active_game]);

  return (
    <AccordionItem bg="#fffc">
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="center">
            <Text as="h2" textAlign="center" fontSize="1.1em" fontWeight="700">
              Stats
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
        <Text>Games Played: {stats?.games_played}</Text>
        <Text>Games Won: {stats?.victories_num}</Text>
        <Text>Games Penalized: {stats?.penalties_num}</Text>
        <Flex>
          <Text>Total Reward:&nbsp;</Text>
          {stats?.total_reward && stats?.total_reward.length > 0 ? (
            stats.total_reward.map((item, index) => (
              <Text key={item[0]}>
                {index > 0 && `, `}
                {utils.format.formatNearAmount(
                  BigInt(item[1]).toString(),
                  2
                )}{" "}
                {<TokenName tokenId={item[0]} />}
              </Text>
            ))
          ) : (
            <Text>0</Text>
          )}
        </Flex>
        <Flex>
          <Text>Total Affiliate Reward:&nbsp;</Text>
          {stats?.total_affiliate_reward &&
          stats?.total_affiliate_reward.length > 0 ? (
            stats?.total_affiliate_reward.map((item, index) => (
              <Text key={item[0]}>
                {index > 0 && `, `}
                {utils.format.formatNearAmount(
                  BigInt(item[1]).toString(),
                  2
                )}{" "}
                {<TokenName tokenId={item[0]} />}
              </Text>
            ))
          ) : (
            <Text>0</Text>
          )}
        </Flex>
        {stats?.referrer_id && (
          <Text>Referrer Account: {stats?.referrer_id}</Text>
        )}
      </AccordionPanel>
    </AccordionItem>
  );
}
