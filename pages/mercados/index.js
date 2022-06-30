import { prisma } from 'lib/prisma'

import { useMemo } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import { Link, Table, Thead, Tbody, Td, Tr, Th, Box, Flex } from '@chakra-ui/react'
import { useTable, useSortBy } from 'react-table'
import { RoundedFrame } from 'components/RoundedFrame'

const MarketsTable = ({ markets }) => {
  const data = useMemo(() => markets, [markets])

  const columns = useMemo(
    () => [
      { Header: 'Nome', accessor: 'name' },
      { Header: 'Fantasia', accessor: 'fantasia' },
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
        {rows.map(({ original: { id, name, fantasia, nickname, address } }) => (
          <Tr key={id}>
            <Td>
              <NextLink passHref href={`/mercados/${encodeURIComponent(id)}`}>
                <Link>{name}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href={`/mercados/${encodeURIComponent(id)}`}>
                <Link>{fantasia}</Link>
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
    <Flex direction="column" gap={2}>
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          Filtros..., adicionar mercado, editar
        </Box>
      </Flex>
      <RoundedFrame>
        <MarketsTable markets={markets} />
      </RoundedFrame>
    </Flex>
  </>
)

export const getServerSideProps = async () => {
  const markets = await prisma.market.findMany({
    select: {
      id: true,
      name: true,
      fantasia: true,
      nickname: true,
      address: true,
    },
  })

  return {
    props: { markets: JSON.parse(JSON.stringify(markets)) }, // will be passed to the page component as props
  }
}

export default Markets
