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
        <tr className="odd:bg-slate-100">
          <td className="px-2 whitespace-nowrap">Nome</td>
          <td className="px-2 w-full">{name}</td>
        </tr>
        <tr className="odd:bg-slate-100">
          <td className="px-2 whitespace-nowrap">Nome fantasia</td>
          <td className="px-2 w-full">{fantasia}</td>
        </tr>
        <tr className="odd:bg-slate-100">
          <td className="px-2 whitespace-nowrap">CNPJ</td>
          <td className="px-2 w-full">{cnpj}</td>
        </tr>
        <tr className="odd:bg-slate-100">
          <td className="px-2 whitespace-nowrap">Endereço</td>
          <td className="px-2 w-full">{address}</td>
        </tr>
        <tr className="odd:bg-slate-100">
          <td className="px-2 whitespace-nowrap">CEP</td>
          <td className="px-2 w-full">{cep}</td>
        </tr>
        <tr className="odd:bg-slate-100">
          <td className="px-2">Alias</td>
          <td className="px-2 w-full">
            <CustomControls defaultValue={nickname} />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
