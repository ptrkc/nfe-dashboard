import { prisma } from 'lib/prisma'

import { useMemo, useState } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import { Link, Table, Thead, Tbody, Td, Tr, Th, ButtonGroup, Button, Box } from '@chakra-ui/react'
import { useTable, useSortBy } from 'react-table'
import { formatBRL } from 'lib/formatBRL'
import { dateSlice } from 'lib/dateSlice'

const NotasTable = ({ notas, size = 'md' }) => {
  const data = useMemo(() => notas, [notas])
  const totalSum = useMemo(() => notas.reduce(
    (previousValue, currentValue) => previousValue + parseFloat(currentValue.total), 0,
  ), [notas])
  const columns = useMemo(
    () => [
      { Header: 'Chave de Acesso', accessor: 'id', disableSortBy: true },
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
    <Table variant="striped" colorScheme="gray" size={size} {...getTableProps()}>
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
                  <Link title={id}>...{id.slice(-8)}</Link>
                </NextLink>
              </Td>
              <Td>
                <NextLink passHref href={`/notas/${id}`}>
                  <Link>{marketName}</Link>
                </NextLink>
              </Td>
              <Td>
                <NextLink passHref href={`/notas/${id}`}>
                  <Link>{dateSlice(date)}</Link>
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
          <Td colSpan={3} />
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

const TableSizeSelector = ({ tableSize, setTableSize }) => {
  const sizes = ['sm', 'md', 'lg']
  return (
    <ButtonGroup size="sm" isAttached variant="outline">
      {sizes.map((value, index) => (
        <Button disabled={tableSize === value} onClick={() => setTableSize(value)} key={value}>{index}</Button>
      ))}
    </ButtonGroup>)
}

const Notas = ({ notas }) => {
  const [tableSize, setTableSize] = useState('md')
  return (
    <>
      <Head>
        <title>NFe Dashboard</title>
      </Head>
      <Box>
        <NextLink href="/notas/new" passHref>
          <Link>new</Link>
        </NextLink>
        <TableSizeSelector tableSize={tableSize} setTableSize={setTableSize} />
        <NotasTable size={tableSize} notas={notas} />
      </Box>
    </>
  )
}

export const getServerSideProps = async () => {
  const notas = await prisma.nota.findMany({
    select: {
      id: true,
      date: true,
      total: true,
      market: {
        select: {
          name: true,
        },
      },
    },
  })

  return {
    props: { notas: JSON.parse(JSON.stringify(notas)) }, // will be passed to the page component as props
  }
}

export default Notas
