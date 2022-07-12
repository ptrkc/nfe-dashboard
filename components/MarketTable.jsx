import { Button, ButtonGroup, Editable, EditableInput, EditablePreview, Flex, Input, useEditableControls } from '@chakra-ui/react';

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
    <table>
      <thead>
        <tr><th colSpan="2">Mercado</th></tr>
      </thead>
      <tbody>
        <tr>
          <td className="whitespace-nowrap">Nome</td>
          <td className="w-full">{name}</td>
        </tr>
        <tr>
          <td className="whitespace-nowrap">Nome fantasia</td>
          <td className="w-full">{fantasia}</td>
        </tr>
        <tr>
          <td className="whitespace-nowrap">CNPJ</td>
          <td className="w-full">{cnpj}</td>
        </tr>
        <tr>
          <td className="whitespace-nowrap">Endereço</td>
          <td className="w-full">{address}</td>
        </tr>
        <tr>
          <td className="whitespace-nowrap">CEP</td>
          <td className="w-full">{cep}</td>
        </tr>
        <tr>
          <td>Alias</td>
          <td className="w-full">
            <CustomControls defaultValue={nickname} />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
