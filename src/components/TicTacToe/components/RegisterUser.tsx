import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import {
  AccordionItem,
  Flex,
  IconButton,
  Input,
  Text,
  useClipboard,
} from "@chakra-ui/react";
import { useState } from "react";
import { useWalletSelector } from "../../../contexts/WalletSelectorContext";
import { ErrorModal } from "../../../shared/components/ErrorModal";
import { getErrorMessage } from "../../../shared/helpers/getErrorMsg";

type Props = {
  isUserRegistered:boolean
  setUserRegisterStatus: (status: boolean) => void;
};
export function RegisterUser({ setUserRegisterStatus,isUserRegistered }: Props) {
  const walletSelector = useWalletSelector();
  const [errorMsg, setErrorMsg] = useState("");

  function registerUser() {
    walletSelector.ticTacToeLogic?.registerAccount().catch((error) => {
      console.error(error);
      setErrorMsg(getErrorMessage(error));
    });
  }

  function unRegisterUser() {
    walletSelector.ticTacToeLogic?.unregisterAccount().catch((error) => {
      console.error(error);
      setErrorMsg(getErrorMessage(error));
    });
  }

  return (
    <AccordionItem bg="#fffc" borderRadius="0 0 8px 8px">
      
      <ErrorModal msg={errorMsg} setMsg={setErrorMsg} />
    </AccordionItem>
  );
}
