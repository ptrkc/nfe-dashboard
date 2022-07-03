export default function formatBRL(value) {
  const parsedValue = parseFloat(value);
  return !Number.isNaN(parsedValue)
    ? parsedValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    : value;
}
