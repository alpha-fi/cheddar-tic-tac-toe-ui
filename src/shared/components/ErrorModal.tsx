import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

type Props = {
  msg: string;
  setMsg: React.Dispatch<React.SetStateAction<string>>;
};

export function ErrorModal({ msg, setMsg }: Props) {
  const { onClose } = useDisclosure();
  const handleClose = () => {
    setMsg("");
    onClose();
  };

  return (
    <Modal isOpen={msg.trim() !== ""} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>ERROR</ModalHeader>
        <ModalCloseButton onClick={handleClose} />
        <ModalBody>
          <Text textAlign="center">{msg}</Text>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="purple"
            bg="purpleCheddar"
            mr={3}
            onClick={handleClose}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
