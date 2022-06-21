import { prisma } from 'lib/prisma'

import { useMemo } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import { Box, HStack, Link, Stat, StatHelpText, StatLabel, StatNumber, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { useTable, useSortBy } from 'react-table'
import { formatBRL } from 'lib/formatBRL'
import { formatLongDateBR } from 'lib/formatLongDateBR'
import { MarketTable } from 'components/MarketTable'
import { RoundedFrame } from 'components/RoundedFrame'

const NotaStatCard = ({ nota: { date, total, market: { name, nickname } } }) => (
  <RoundedFrame pt={2} px={2} bg="blackAlpha.700">
    <Stat>
      <StatLabel>{nickname || name}</StatLabel>
      <StatNumber>{formatBRL(total)}</StatNumber>
      <StatHelpText>{formatLongDateBR(date)}</StatHelpText>
    </Stat>
  </RoundedFrame>
)

const PurchasesTable = ({ purchases }) => {
  const data = useMemo(() => purchases, [purchases])
  const totals = useMemo(() => purchases.reduce(
    (previousValue, currentValue) => {
      const { unitPrice, regularPrice, discount, chargedPrice } = previousValue
      return {
        unitPrice: unitPrice + (parseFloat(currentValue.unitPrice) || 0),
        regularPrice: regularPrice + (parseFloat(currentValue.regularPrice) || 0),
        discount: discount + (parseFloat(currentValue.discount) || 0),
        chargedPrice: chargedPrice + (parseFloat(currentValue.chargedPrice) || 0),
      }
    },
    { unitPrice: 0, regularPrice: 0, discount: 0, chargedPrice: 0 },
  ), [purchases])
  const columns = useMemo(
    () => [
      { Header: 'Nome', accessor: 'name' },
      { Header: 'EAN', accessor: 'ean', disableSortBy: true },
      { Header: 'Quantidade', accessor: 'quantity' },
      { Header: 'UN', accessor: 'unit', disableSortBy: true },
      { Header: 'Preço Un', accessor: 'unitPrice', disableSortBy: true },
      { Header: 'Preço', accessor: 'regularPrice', disableSortBy: true },
      { Header: 'Desconto', accessor: 'discount' },
      { Header: 'Total', accessor: 'chargedPrice' },
    ],
    [],
  )
  const initialState = useMemo(() => ({ sortBy: [{ id: 'chargedPrice', desc: true }] }), [])

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
        {rows.map(({ original: {
          id, name, ean, quantity, unit, unitPrice, regularPrice, discount, chargedPrice,
        } }) => (
          <Tr key={id}>
            <Td>
              <NextLink passHref href="/">
                <Link>{name}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href={`$/produtos/${ean}`}>
                <Link>{ean}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href="/">
                <Link>{quantity}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href="/">
                <Link>{unit}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href="/">
                <Link>{formatBRL(unitPrice)}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href="/">
                <Link>{formatBRL(regularPrice)}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href="/">
                <Link>{formatBRL(discount)}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href="/">
                <Link>{formatBRL(chargedPrice)}</Link>
              </NextLink>
            </Td>
          </Tr>
        ))}
        <Tr>
          <Td colSpan={4} />
          <Td>
            <NextLink passHref href="/">
              <Link>{formatBRL(totals.unitPrice)}</Link>
            </NextLink>
          </Td>
          <Td>
            <NextLink passHref href="/">
              <Link>{formatBRL(totals.regularPrice)}</Link>
            </NextLink>
          </Td>
          <Td>
            <NextLink passHref href="/">
              <Link>{formatBRL(totals.discount)}</Link>
            </NextLink>
          </Td>
          <Td>
            <NextLink passHref href="/">
              <Link>{formatBRL(totals.chargedPrice)}</Link>
            </NextLink>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  )
}

const Nota = ({ nota }) => {
  const { purchases, market } = nota
  return (
    <>
      <Head>
        <title>NFe Dashboard | Nota</title>
      </Head>
      <Box>
        <HStack mb="4">
          <NotaStatCard nota={nota} />
          <RoundedFrame>
            <Table>
              <Thead>
                <Tr><Th colSpan="2">Nota</Th></Tr>
              </Thead>
              <Tbody>
                <Tr><Td>Chave de acesso</Td><Td>{nota.id}</Td></Tr>
                <Tr><Td>Data</Td><Td>{formatLongDateBR(nota.date)}</Td></Tr>
                <Tr><Td>Total</Td><Td>{formatBRL(nota.total)}</Td></Tr>
              </Tbody>
            </Table>
          </RoundedFrame>
          <RoundedFrame>
            <MarketTable market={market} />
          </RoundedFrame>
        </HStack>
        <RoundedFrame>
          <PurchasesTable purchases={purchases} />
        </RoundedFrame>
      </Box>
    </>
  )
}

export const getServerSideProps = async ({ query }) => {
  const { id } = query
  const nota = await prisma.nota.findUnique({
    where: { id },
    select: {
      id: true,
      date: true,
      total: true,
      market: {
        select: {
          id: true,
          name: true,
          fantasia: true,
          cnpj: true,
          address: true,
          cep: true,
          nickname: true,
        },
      },
      purchases: {
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
        },
      },
    },
  })

  return {
    props: { nota: JSON.parse(JSON.stringify(nota)) }, // will be passed to the page component as props
  }
}

export default Nota
