export const formatBRL = (value) => {
  const parsedValue = parseFloat(value)
  return String(parsedValue) === value
    ? parsedValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    : value
}
