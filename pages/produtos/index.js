import { prisma } from 'lib/prisma'

import { useMemo } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import { Link, Table, Thead, Tbody, Td, Tr, Th, Box, Flex } from '@chakra-ui/react'
import { useTable, useSortBy } from 'react-table'
import { RoundedFrame } from 'components/RoundedFrame'

const PurchasesTable = ({ purchases }) => {
  const data = useMemo(() => purchases, [purchases])

  const columns = useMemo(
    () => [
      { Header: 'id', accessor: 'id' },
      { Header: 'name', accessor: 'name' },
      { Header: 'ean', accessor: 'ean' },
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
        {rows.map(({ original: { id, ean, name } }) => (
          <Tr key={id}>
            <Td>
              <NextLink passHref href={`/produtos/${encodeURIComponent(ean)}`}>
                <Link title={id}>{id}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href={`/produtos/${encodeURIComponent(ean)}`}>
                <Link>{name}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href={`/produtos/${encodeURIComponent(ean)}`}>
                <Link>{ean}</Link>
              </NextLink>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

const Purchases = ({ purchases }) => (
  <>
    <Head>
      <title>NFe Dashboard | Produtos</title>
    </Head>
    <Flex direction="column" gap={2}>
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          Filtros..., adicionar mercado, editar
        </Box>
      </Flex>
      <RoundedFrame>
        <PurchasesTable purchases={purchases} />
      </RoundedFrame>
    </Flex>
  </>
)

export const getServerSideProps = async () => {
  const purchases = await prisma.purchase.findMany({
    where: {},
    distinct: ['ean'],
    select: {
      id: true,
      name: true,
      ean: true,
      quantity: true,
      unit: true,
      unitPrice: true,
      regularPrice: true,
      discount: true,
      chargedPrice: true,
      receiptId: true,
      marketId: true,
    },
  })

  return {
    props: { purchases: JSON.parse(JSON.stringify(purchases)) }, // will be passed to the page component as props
  }
}

export default Purchases
