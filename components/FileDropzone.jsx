import { useRef, useState } from 'react';
import {
  Center, HStack, Icon, Input, List, ListItem, Spinner, Text, Tooltip,
  VStack,
} from '@chakra-ui/react';
import { FiUploadCloud, FiTrash2, FiFileText } from 'react-icons/fi';

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
    <button
      aria-label="Deletar arquivo"
      type="button"
      onClick={removeFile}
      className="btn-icon btn-blue"
    >
      <FiTrash2 />

    </button>
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
    const validFiles = [...event.target.files].filter((file) => file.type === 'text/html');
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
            <p className="text-blue-400 font-bold hover:text-blue-500 duration-150">
              Clique para selecionar
            </p>
            <p>
              ou arraste o(s) arquivo(s) HTML
            </p>
          </VStack>
        </>
      ) : (
        <>
          <List w="full" spacing={2}>
            {selectedFiles.map(({ name, status }) => (
              <ListItem key={name} gap={2}>
                <div className="rounded-frame flex p-2 justify-between items-center">
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
                </div>
              </ListItem>
            ))}
          </List>
          <div className="pt-2">
            <button
              type="button"
              className="text-blue-400 font-bold hover:text-blue-500 duration-150"
              onClick={() => inputRef.current.click()}
            >
              Clique para selecionar
            </button>
            <Text as="span">
              {' '}
              ou arraste o(s) arquivo(s) HTML
            </Text>
          </div>
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
