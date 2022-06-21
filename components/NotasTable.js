import { useMemo } from 'react'
import NextLink from 'next/link'
import { Tr, Td, Table, Thead, Th, Tbody, Link } from '@chakra-ui/react'
import { useSortBy, useTable } from 'react-table'
import { formatBRL } from 'lib/formatBRL'
import { formatLongDateBR } from 'lib/formatLongDateBR'
import { dateSlice } from 'lib/dateSlice'

export const NotasTable = ({ notas }) => {
  const data = useMemo(() => notas, [notas])
  const totalSum = useMemo(() => notas.reduce(
    (previousValue, currentValue) => previousValue + parseFloat(currentValue.total), 0,
  ), [notas])
  const columns = useMemo(
    () => [
      { Header: 'Mercado', accessor: 'market.name' },
      { Header: 'Data', accessor: 'date' },
      { Header: 'Total', accessor: 'total', isNumeric: true },
    ],
    [],
  )
  const initialState = useMemo(() => ({ sortBy: [{ id: 'date', desc: false }] }), [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
  } = useTable({ columns, data, initialState }, useSortBy)

  return (
    <Table {...getTableProps()}>
      <Thead>
        {headerGroups.map(headerGroup => (
          // eslint-disable-next-line react/jsx-key
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              // eslint-disable-next-line react/jsx-key
              <Th
                {...(column.isNumeric && { isNumeric: true })}
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                {column.render('Header')}
                <span>
                  {/* eslint-disable-next-line no-nested-ternary */}
                  {column.canSort && (column.isSorted
                    ? column.isSortedDesc
                      ? ' ↑'
                      : ' ↓'
                    : ' ↕')}
                </span>
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map(({ original: { id, market, date, total } }) => {
          const marketName = market.nickname || market.name
          return (
            <Tr key={id}>
              <Td>
                <NextLink passHref href={`/notas/${id}`}>
                  <Link>{marketName}</Link>
                </NextLink>
              </Td>
              <Td>
                <NextLink passHref href={`/notas/${id}`}>
                  <Link title={formatLongDateBR(date)}>{dateSlice(date)}</Link>
                </NextLink>
              </Td>
              <Td isNumeric>
                <NextLink passHref href={`/notas/${id}`}>
                  <Link>{formatBRL(total)}</Link>
                </NextLink>
              </Td>
            </Tr>
          )
        })}
        <Tr>
          <Td colSpan={2} />
          <Td isNumeric>
            <NextLink passHref href="/">
              <Link>{formatBRL(totalSum)}</Link>
            </NextLink>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  )
}
