import prisma from 'lib/prisma';

import { useMemo } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { Box, Flex, Link, Table, Tbody, Td, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { useTable, useSortBy } from 'react-table';

import formatBRL from 'lib/formatBRL';
import { formatLongDateBR, formatTimeBR } from 'lib/formatLongDateBR';
import MarketTable from 'components/MarketTable';
import DeleteConfirmation from 'components/DeleteConfirmation';

function ReceiptStatCard({ receipt: { id, date, total, qrCode, market: { name, nickname } } }) {
  return (
    <div className="rounded-frame p-2">
      <p className="text-sm">{nickname || name}</p>
      <p className="font-bold text-2xl">{formatBRL(total)}</p>
      <p className="text-sm">{`${formatLongDateBR(date)}, ${formatTimeBR(date)}`}</p>
      <p className="text-sm text-gray-600">
        <a href={qrCode} target="_blank" rel="noopener noreferrer">{id}</a>
      </p>
    </div>
  );
}

function PurchasesTable({ purchases }) {
  const data = useMemo(() => purchases, [purchases]);
  const totals = useMemo(() => purchases.reduce(
    (previousValue, currentValue) => {
      const { unitPrice, regularPrice, discount, chargedPrice } = previousValue;
      return {
        unitPrice: unitPrice + (parseFloat(currentValue.unitPrice) || 0),
        regularPrice: regularPrice + (parseFloat(currentValue.regularPrice) || 0),
        discount: discount + (parseFloat(currentValue.discount) || 0),
        chargedPrice: chargedPrice + (parseFloat(currentValue.chargedPrice) || 0),
      };
    },
    { unitPrice: 0, regularPrice: 0, discount: 0, chargedPrice: 0 },
  ), [purchases]);
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
  );
  const initialState = useMemo(() => ({ sortBy: [{ id: 'chargedPrice', desc: true }] }), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
  } = useTable({ columns, data, initialState }, useSortBy);

  return (
    <Table {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup) => (
          // eslint-disable-next-line react/jsx-key
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
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
        {rows.map(({ original: row }) => (
          <Tr key={row.id}>
            <Td>
              <NextLink passHref href="/">
                <Link>{row.name}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href={`/produtos/${row.ean}`}>
                <Link>{row.ean}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href="/">
                <Link>{row.quantity}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href="/">
                <Link>{row.unit}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href="/">
                <Link>{formatBRL(row.unitPrice)}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href="/">
                <Link>{formatBRL(row.regularPrice)}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href="/">
                <Link>{formatBRL(row.discount)}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href="/">
                <Link>{formatBRL(row.chargedPrice)}</Link>
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
  );
}

function Receipt({ receipt }) {
  const { purchases, market } = receipt;
  return (
    <>
      <Head>
        <title>💸 NFe Dashboard | Nota</title>
      </Head>
      <VStack gap="2" alignItems="flex-start">
        <Flex direction={{ base: 'column', lg: 'row' }} gap={2}>
          <Box>
            <ReceiptStatCard receipt={receipt} />
          </Box>
          <Box>
            <div className="rounded-frame">
              <MarketTable market={market} />
            </div>
          </Box>
        </Flex>
        <div className="rounded-frame">
          <PurchasesTable purchases={purchases} />
        </div>
        <DeleteConfirmation
          reqUrl={`/api/notas/${receipt.id}`}
          redirectUrl="/notas"
          header="Deletar Nota"
          body="Tem certeza que deseja excluir essa nota?"
        />
      </VStack>
    </>
  );
}

export const getServerSideProps = async ({ query }) => {
  const { id } = query;
  const receipt = await prisma.receipt.findUnique({
    where: { id },
    select: {
      id: true,
      date: true,
      total: true,
      filteredTotal: true,
      qrCode: true,
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
          ignore: true,
        },
      },
    },
  });

  return { props: { receipt: JSON.parse(JSON.stringify(receipt)) } };
};

export default Receipt;
