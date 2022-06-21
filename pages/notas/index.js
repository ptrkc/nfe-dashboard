import { prisma } from 'lib/prisma'

import { useMemo } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import { Link, Table, Thead, Tbody, Td, Tr, Th, Button, Box, Flex } from '@chakra-ui/react'
import { useTable, useSortBy } from 'react-table'
import { dateSlice } from 'lib/dateSlice'
import { formatBRL } from 'lib/formatBRL'
import { formatLongDateBR } from 'lib/formatLongDateBR'
import { RoundedFrame } from 'components/RoundedFrame'

const NotasTable = ({ notas }) => {
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

const Notas = ({ notas }) => (
  <>
    <Head>
      <title>NFe Dashboard | Notas</title>
    </Head>
    <Flex direction="column" gap="2">
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          Filtros, data, mercado,...?
        </Box>
        <NextLink href="/notas/new" passHref>
          <Button as={Link}>+ Nova Nota</Button>
        </NextLink>
      </Flex>
      <RoundedFrame>
        <NotasTable notas={notas} />
      </RoundedFrame>
    </Flex>
  </>
)

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
