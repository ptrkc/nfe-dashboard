import { useRef, useState } from 'react'
import { Box, Button, Center, HStack, Icon, IconButton, Input, List, ListItem, Text, VStack } from '@chakra-ui/react'
import { FiUploadCloud, FiTrash2, FiFileText } from 'react-icons/fi'
import { RoundedFrame } from 'components/RoundedFrame'

const DropzoneFrame = (props) => {
  const {
    children,
    isEmpty,
    inputRef,
    onDrop: onDropLogic,
    ...rest
  } = props
  const [isHovering, setIsHovering] = useState(false)

  const stopDefaults = (event) => {
    event.stopPropagation()
    event.preventDefault()
  }
  const onDragEnter = stopDefaults
  const onDragOver = (event) => {
    stopDefaults(event)
    setIsHovering(true)
  }
  const onDragLeave = (event) => {
    stopDefaults(event)
    setIsHovering(false)
  }
  const onDrop = (event) => {
    stopDefaults(event)
    setIsHovering(false)
    onDropLogic(event)
  }
  const onClick = () => isEmpty && inputRef.current.click()

  return (
    <VStack
      borderRadius={10}
      borderWidth="1px"
      borderStyle="dashed"
      borderColor="inherit"
      _hover={{
        borderColor: 'whiteAlpha.400',
      }}
      transition=".2s"
      overflow="hidden"
      fontSize="sm"
      position="relative"
      cursor={isEmpty ? 'pointer' : 'unset'}
      bg={isHovering ? 'whiteAlpha.500' : 'unset'}
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
  )
}

const DeleteButton = ({ name, selectedFiles, setSelectedFiles }) => {
  const removeFile = () => setSelectedFiles(selectedFiles.filter(file => file.name !== name))
  return (
    <IconButton onClick={removeFile}><FiTrash2 /></IconButton>
  )
}

export const FileDropzone = ({ value: selectedFiles = [], onChange: setSelectedFiles, multiple }) => {
  const isEmpty = !selectedFiles.length
  const inputRef = useRef()

  const onDrop = async (event) => {
    const files = [...selectedFiles]
    for (const item of event.dataTransfer.items) {
      if (item?.kind === 'file') {
        const file = item.getAsFile()
        files.push(file)
      }
    }
    setSelectedFiles(files)
  }

  const handleFilePicker = (event) => {
    const files = [...selectedFiles]
    for (const file of event.target.files) {
      if (file.type === 'text/html') {
        files.push(file)
      }
    }
    setSelectedFiles(files)
  }

  return (
    <DropzoneFrame
      onDrop={onDrop}
      inputRef={inputRef}
      isEmpty={isEmpty}
    >
      {isEmpty ? (
        <>
          <Center
            borderRadius={10}
            bg="whiteAlpha.200"
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
            {selectedFiles.map(({ name }) => (
              <ListItem key={name} gap={2}>
                <RoundedFrame display="flex" p={2} justifyContent="space-between" alignItems="center">
                  <HStack justifyContent="center" alignItems="center">
                    <Icon w={6} h={6} as={FiFileText} />
                    <Text noOfLines={2}>{name}</Text>
                  </HStack>
                  <DeleteButton name={name} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
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
              {' '}ou arraste o(s) arquivo(s) HTML
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
  )
}
