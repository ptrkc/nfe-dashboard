import { prisma } from 'lib/prisma'

import { useMemo } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import { Link, Table, Thead, Tbody, Td, Tr, Th, Button, Box, Flex } from '@chakra-ui/react'
import { useTable, useSortBy } from 'react-table'

const MarketsTable = ({ markets }) => {
  const data = useMemo(() => markets, [markets])

  const columns = useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Nome', accessor: 'name' },
      { Header: 'Alias', accessor: 'nickname' },
      { Header: 'Endereço', accessor: 'address' },
    ],
    [],
  )
  const initialState = useMemo(() => ({ sortBy: ['name'] }), [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
  } = useTable({ columns, data, initialState }, useSortBy)

  return (
    <Table colorScheme="gray" {...getTableProps()}>
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
        {rows.map(({ original: { id, name, nickname, address } }) => (
          <Tr key={id}>
            <Td>
              <NextLink passHref href={`/mercados/${encodeURIComponent(id)}`}>
                <Link title={id}>{id}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href={`/mercados/${encodeURIComponent(id)}`}>
                <Link>{name}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href={`/mercados/${encodeURIComponent(id)}`}>
                <Link>{nickname}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href={`/mercados/${encodeURIComponent(id)}`}>
                <Link>{address}</Link>
              </NextLink>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

const Markets = ({ markets }) => (
  <>
    <Head>
      <title>NFe Dashboard | Mercados</title>
    </Head>
    <Flex direction="column" gap="2">
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          Filtros..., adicionar mercado, editar
        </Box>
        <NextLink href="/mercados/new" passHref>
          <Button as={Link}>+ Novo Mercado</Button>
        </NextLink>
      </Flex>
      <Box borderRadius="10" boxShadow="md" overflow="hidden">
        <MarketsTable markets={markets} />
      </Box>
    </Flex>
  </>
)

export const getServerSideProps = async () => {
  const markets = await prisma.market.findMany({
    select: {
      id: true,
      name: true,
      nickname: true,
      address: true,
    },
  })

  return {
    props: { markets: JSON.parse(JSON.stringify(markets)) }, // will be passed to the page component as props
  }
}

export default Markets
