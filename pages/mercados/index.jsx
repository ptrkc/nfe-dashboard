import prisma from 'lib/prisma';

import { useMemo } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { Link, Table, Thead, Tbody, Td, Tr, Th, Box, Flex } from '@chakra-ui/react';
import { useTable, useSortBy } from 'react-table';

function MarketsTable({ markets }) {
  const data = useMemo(() => markets, [markets]);

  const columns = useMemo(
    () => [
      { Header: 'Nome', accessor: 'name' },
      { Header: 'Fantasia', accessor: 'fantasia' },
      { Header: 'Alias', accessor: 'nickname' },
      { Header: 'Endereço', accessor: 'address' },
      { Header: 'Notas', accessor: 'totalReceipts' },
    ],
    [],
  );
  const initialState = useMemo(() => ({ sortBy: ['name'] }), []);

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
        {rows.map(({ original: row }) => (
          <Tr key={row.id}>
            <Td>
              <NextLink passHref href={`/mercados/${encodeURIComponent(row.id)}`}>
                <Link>{row.name}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href={`/mercados/${encodeURIComponent(row.id)}`}>
                <Link>{row.fantasia}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href={`/mercados/${encodeURIComponent(row.id)}`}>
                <Link>{row.nickname}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href={`/mercados/${encodeURIComponent(row.id)}`}>
                <Link>{row.address}</Link>
              </NextLink>
            </Td>
            <Td>
              <NextLink passHref href={`/mercados/${encodeURIComponent(row.id)}`}>
                <Link>{row.totalReceipts}</Link>
              </NextLink>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

function Markets({ markets }) {
  return (
    <>
      <Head>
        <title>💸 NFe Dashboard | Mercados</title>
      </Head>
      <Flex direction="column" gap={2}>
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            Filtros..., adicionar mercado, editar
          </Box>
        </Flex>
        <div className="rounded-frame">
          <MarketsTable markets={markets} />
        </div>
      </Flex>
    </>
  );
}

export const getServerSideProps = async () => {
  const markets = await prisma.market.findMany({
    select: {
      id: true,
      name: true,
      fantasia: true,
      nickname: true,
      address: true,
      _count: { select: { receipts: true } },
    },
  });

  return {
    props: {
      markets: markets.map(({ _count, ...market }) => (
        { ...market, totalReceipts: _count.receipts }
      )),
    },
  };
};

export default Markets;
