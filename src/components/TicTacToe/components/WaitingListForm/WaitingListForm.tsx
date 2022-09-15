import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Text,
} from "@chakra-ui/react";
import { utils } from "near-api-js";
import { useState } from "react";
import { useWalletSelector } from "../../../../contexts/WalletSelectorContext";
import { WhiteListedTokens } from "../../../../hooks/useWhiteListedTokens";
import { ErrorModal } from "../../../../shared/components/ErrorModal";
import { PurpleButton } from "../../../../shared/components/PurpleButton";
import { getErrorMessage } from "../../../../shared/helpers/getErrorMsg";
import { OpponentInput } from "./OpponentInput";
import { PriceInput } from "./PriceInput";

type Props = {
  tokensData: WhiteListedTokens[];
};

export default function WaitingListForm({ tokensData }: Props) {
  const [bidInput, setBidInput] = useState("");
  const [opponentInput, setOpponentInput] = useState({
    id: "",
    exist: false,
    loading: false,
  });
  const [tokenName, setTokenName] = useState(tokensData[0].name);
  const [minDeposit, setMinDeposit] = useState(tokensData[0].minDeposit);
  const [withCheddar, setWithCheddar] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const walletSelector = useWalletSelector();

  const params = new URLSearchParams(window.location.search);

  const referral = params.get("r") ?? undefined;

  const handleOnClick = () => {
    walletSelector.ticTacToeLogic
      ?.bet(
        parseFloat(bidInput),
        withCheddar,
        referral,
        opponentInput.id.trim() === "" ? undefined : opponentInput.id
      )
      .catch((error) => {
        console.error(error);
        setErrorMsg(getErrorMessage(error));
      });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTokenName(e.target.value);
    setMinDeposit(
      tokensData.find((item) => item.name === e.target.value)?.minDeposit || "1"
    );
    if (e.target.value === "CHEDDAR") {
      setWithCheddar(true);
    } else {
      setWithCheddar(false);
    }
  };

  return (
    <>
      <AccordionItem bg="#fffc" borderRadius="0 0 8px 8px">
        <h2>
          <AccordionButton _focus={{ boxShadow: "0 0 0 0 #0000" }}>
            <Box flex="1" textAlign="center">
              <Text
                as="h2"
                textAlign="center"
                fontSize="1.1em"
                fontWeight="700"
              >
                Join Waiting List
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
          <FormControl mb="10px">
            <Flex
              justifyContent="center"
              alignItems="center"
              flexDirection={{ base: "column", sm: "row" }}
            >
              <FormLabel
                w={{ base: "190px", sm: "75px" }}
                textAlign={{ base: "left", sm: "right" }}
                mb="0"
              >
                FT&nbsp;Type:
              </FormLabel>
              <Select
                w="200px"
                bg="#fffb"
                mr="10px"
                value={tokenName}
                onChange={handleSelectChange}
              >
                {tokensData.map((item) => (
                  <option key={item.name}>{item.name}</option>
                ))}
              </Select>
            </Flex>
          </FormControl>
          {
            <PriceInput
              bidInput={bidInput}
              setBidInput={setBidInput}
              minDeposit={minDeposit}
              tokenName={tokenName}
            />
          }
          <OpponentInput
            opponentInput={opponentInput}
            setOpponentInput={setOpponentInput}
          />
          <Flex justifyContent="center">
            <PurpleButton
              onClick={handleOnClick}
              disabled={
                (opponentInput.id.trim() !== "" && !opponentInput.exist) ||
                parseFloat(bidInput) <
                  parseFloat(utils.format.formatNearAmount(minDeposit)) ||
                bidInput.trim() === ""
              }
            >
              Join Waiting List
            </PurpleButton>
          </Flex>
        </AccordionPanel>
      </AccordionItem>
      <ErrorModal msg={errorMsg} setMsg={setErrorMsg} />
    </>
  );
}
