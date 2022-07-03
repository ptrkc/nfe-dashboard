import { useRef, useState } from 'react';
import {
  Box, Button, Center, HStack, Icon, IconButton, Input, List, ListItem, Spinner, Text, Tooltip,
  VStack,
} from '@chakra-ui/react';
import { FiUploadCloud, FiTrash2, FiFileText } from 'react-icons/fi';
import RoundedFrame from 'components/RoundedFrame';

const statusIcon = {
  loading: {
    text: 'Enviando...',
    icon: <Spinner />,
  },
  error: {
    text: 'Erro',
    icon: '❌',
  },
  added: {
    text: 'Adicionada',
    icon: '✅',
  },
  alreadyAdded: {
    text: 'Já adicionada',
    icon: '😎',
  },
};

function DropzoneFrame(props) {
  const {
    children,
    isEmpty,
    inputRef,
    onDrop: onDropLogic,
    ...rest
  } = props;
  const [isHovering, setIsHovering] = useState(false);

  const stopDefaults = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };
  const onDragEnter = stopDefaults;
  const onDragOver = (event) => {
    stopDefaults(event);
    setIsHovering(true);
  };
  const onDragLeave = (event) => {
    stopDefaults(event);
    setIsHovering(false);
  };
  const onDrop = (event) => {
    stopDefaults(event);
    setIsHovering(false);
    onDropLogic(event);
  };
  const onClick = () => isEmpty && inputRef.current.click();

  return (
    <VStack
      borderRadius="md"
      borderWidth="1px"
      borderStyle="dashed"
      borderColor="inherit"
      _hover={{ borderColor: 'blackAlpha.400' }}
      transition=".2s"
      overflow="hidden"
      fontSize="sm"
      position="relative"
      cursor={isEmpty ? 'pointer' : 'unset'}
      bg={isHovering ? 'blackAlpha.500' : 'unset'}
      p={4}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      {...rest}
    >
      {children}
    </VStack>
  );
}

function DeleteButton({ name, selectedFiles, setSelectedFiles }) {
  const removeFile = () => setSelectedFiles(selectedFiles.filter((file) => file.name !== name));
  return (
    <IconButton onClick={removeFile}><FiTrash2 /></IconButton>
  );
}

const readFile = (file) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.readAsText(file);
});

export default function FileDropzone({
  value: selectedFiles = [],
  onChange: setSelectedFiles,
  multiple,
}) {
  const isEmpty = !selectedFiles.length;
  const inputRef = useRef();

  const onDrop = async (event) => {
    const validItems = event.dataTransfer.items.filter((item) => item?.kind === 'file');
    const newSelectedFiles = await Promise.all(validItems.map(async (item) => {
      const file = item.getAsFile();
      const content = await readFile(file);
      return { name: file.name, content };
    }));
    setSelectedFiles([...selectedFiles, ...newSelectedFiles]);
  };

  const handleFilePicker = async (event) => {
    const validFiles = event.target.files.filter((file) => file.type === 'text/html');
    const newSelectedFiles = await Promise.all(validFiles.map(async (file) => {
      const content = await readFile(file);
      return { name: file.name, content };
    }));
    setSelectedFiles([...selectedFiles, ...newSelectedFiles]);
  };

  return (
    <DropzoneFrame
      onDrop={onDrop}
      inputRef={inputRef}
      isEmpty={isEmpty}
      bg="white"

    >
      {isEmpty ? (
        <>
          <Center
            borderRadius="md"
            bg="blackAlpha.300"
            p={2}

          >
            <Icon as={FiUploadCloud} w={5} h={5} />
          </Center>
          <VStack lineHeight="1">
            <Text color="blue.300" fontWeight="bold">
              Clique para selecionar
            </Text>
            <Text>
              ou arraste o(s) arquivo(s) HTML
            </Text>
          </VStack>
        </>
      ) : (
        <>
          <List w="full" spacing={2}>
            {selectedFiles.map(({ name, status }) => (
              <ListItem key={name} gap={2}>
                <RoundedFrame display="flex" p={2} justifyContent="space-between" alignItems="center">
                  <HStack justifyContent="center" alignItems="center">
                    <Icon w={6} h={6} as={FiFileText} />
                    <Text noOfLines={2}>{name}</Text>
                  </HStack>
                  {status ? (
                    <Tooltip label={statusIcon[status].text}>
                      {statusIcon[status].icon}
                    </Tooltip>
                  ) : (
                    <DeleteButton
                      name={name}
                      selectedFiles={selectedFiles}
                      setSelectedFiles={setSelectedFiles}
                    />
                  )}
                </RoundedFrame>
              </ListItem>
            ))}
          </List>
          <Box pt="2">
            <Button
              variant="link"
              color="blue.300"
              fontWeight="bold"
              fontSize="inherit"
              onClick={() => inputRef.current.click()}
            >
              Clique para selecionar
            </Button>
            <Text as="span">
              {' '}
              ou arraste o(s) arquivo(s) HTML
            </Text>
          </Box>
        </>
      )}
      <Input
        onChange={handleFilePicker}
        type="file"
        ref={inputRef}
        multiple={multiple}
        hidden
      />
    </DropzoneFrame>
  );
}
