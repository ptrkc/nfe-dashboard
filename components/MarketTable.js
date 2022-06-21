import { Button, ButtonGroup, Editable, EditableInput, EditablePreview, Flex, Input, Table, Tbody, Td, Th, Thead,
  Tr, useEditableControls } from '@chakra-ui/react'

const EditableControls = () => {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls()

  return isEditing ? (
    <ButtonGroup size="sm">
      <Button {...getSubmitButtonProps()}>Salvar</Button>
      <Button {...getCancelButtonProps()}>Cancelar</Button>
    </ButtonGroup>
  ) : (
    <Button size="sm" {...getEditButtonProps()}>Editar</Button>
  )
}

const CustomControls = ({ defaultValue }) => (
  <Editable
    onSubmit={e => console.log(e)}
    defaultValue={defaultValue}
    isPreviewFocusable={false}
  >
    <Flex alignItems="center" justifyContent="space-between" gap="2">
      <EditablePreview />
      <Input as={EditableInput} size="sm" />
      <EditableControls />
    </Flex>
  </Editable>
)

export const MarketTable = ({ market: { name, nickname, fantasia, cnpj, address, cep } }) => (
  <Table>
    <Thead>
      <Tr><Th colSpan="2">Mercado</Th></Tr>
    </Thead>
    <Tbody>
      <Tr>
        <Td whiteSpace="nowrap">Nome</Td>
        <Td w="full">{name}</Td>
      </Tr>
      <Tr>
        <Td whiteSpace="nowrap">Nome fantasia</Td>
        <Td w="full">{fantasia}</Td>
      </Tr>
      <Tr>
        <Td whiteSpace="nowrap">CNPJ</Td>
        <Td w="full">{cnpj}</Td>
      </Tr>
      <Tr>
        <Td whiteSpace="nowrap">Endereço</Td>
        <Td w="full">{address}</Td>
      </Tr>
      <Tr>
        <Td whiteSpace="nowrap">CEP</Td>
        <Td w="full">{cep}</Td>
      </Tr>
      <Tr>
        <Td>Alias</Td>
        <Td>
          <CustomControls defaultValue={nickname} />
        </Td>
      </Tr>
    </Tbody>
  </Table>
)
