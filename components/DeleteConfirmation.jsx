import { useRouter } from 'next/router';
import {
  Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
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
      <button type="button" className="btn btn-red" onClick={onOpen}>
        Deletar
      </button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{header}</ModalHeader>
          <ModalCloseButton isDisabled={isLoading} />
          <ModalBody>
            {body}
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="btn btn-blue mr-3"
              onClick={onClose}
              isDisabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={mutate}
              className="btn btn-red"
              isLoading={isLoading}
            >
              Deletar
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
