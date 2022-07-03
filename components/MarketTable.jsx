import {
  Button, ButtonGroup, Editable, EditableInput, EditablePreview, Flex, Input, Table, Tbody, Td, Th,
  Thead, Tr, useEditableControls,
} from '@chakra-ui/react';

function EditableControls() {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls();

  return isEditing ? (
    <ButtonGroup size="xs">
      <Button {...getSubmitButtonProps()}>Salvar</Button>
      <Button {...getCancelButtonProps()}>Cancelar</Button>
    </ButtonGroup>
  ) : (
    <Button size="xs" {...getEditButtonProps()}>Editar</Button>
  );
}

function CustomControls({ defaultValue }) {
  return (
    <Editable
      onSubmit={(event) => console.log(event)} // TODO:
      defaultValue={defaultValue}
      isPreviewFocusable={false}
    >
      <Flex alignItems="center" justifyContent="space-between" gap={2}>
        <EditablePreview />
        <Input as={EditableInput} variant="flushed" size="sm" />
        <EditableControls />
      </Flex>
    </Editable>
  );
}

export default function MarketTable({ market: { name, nickname, fantasia, cnpj, address, cep } }) {
  return (
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
          <Td py="0">
            <CustomControls defaultValue={nickname} />
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
}
