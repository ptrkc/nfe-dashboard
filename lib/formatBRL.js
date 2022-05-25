export const formatBRL = (value) => {
  const parsedValue = parseFloat(value)
  return !isNaN(parsedValue)
    ? parsedValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    : value
}
