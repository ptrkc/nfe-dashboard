import { useRouter } from 'next/router';
import {
  Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useMutation } from 'react-query';
import fetchData from 'lib/fetchData';

export default function DeleteConfirmation({ reqUrl, redirectUrl, header, body }) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isLoading, mutate } = useMutation(
    () => fetchData(reqUrl, { method: 'DELETE' }),
    { onSuccess: () => router.push(redirectUrl) },
  );

  return (
    <>
      <Button colorScheme="red" onClick={onOpen}>
        Deletar
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{header}</ModalHeader>
          <ModalCloseButton isDisabled={isLoading} />
          <ModalBody>
            {body}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={onClose}
              isDisabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={mutate}
              colorScheme="red"
              isLoading={isLoading}
            >
              Deletar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
