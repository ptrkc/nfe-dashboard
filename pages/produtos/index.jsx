import prisma from 'lib/prisma';

import { useMemo } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { Link, Box, Flex } from '@chakra-ui/react';
import { useTable, useSortBy } from 'react-table';

function PurchasesTable({ purchases }) {
  const data = useMemo(() => purchases, [purchases]);

  const columns = useMemo(
    () => [
      { Header: 'id', accessor: 'id' },
      { Header: 'name', accessor: 'name' },
      { Header: 'ean', accessor: 'ean' },
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
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          // eslint-disable-next-line react/jsx-key
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              // eslint-disable-next-line react/jsx-key
              <th
                className={`${column.isNumeric ? 'text-right' : ''}`}
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
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(({ original: { id, ean, name } }) => (
          <tr key={id}>
            <td>
              <NextLink passHref href={`/produtos/${encodeURIComponent(ean)}`}>
                <Link title={id}>{id}</Link>
              </NextLink>
            </td>
            <td>
              <NextLink passHref href={`/produtos/${encodeURIComponent(ean)}`}>
                <Link>{name}</Link>
              </NextLink>
            </td>
            <td className="text-right">
              <NextLink passHref href={`/produtos/${encodeURIComponent(ean)}`}>
                <Link>{ean}</Link>
              </NextLink>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Purchases({ purchases }) {
  return (
    <>
      <Head>
        <title>💸 NFe Dashboard | Produtos</title>
      </Head>
      <Flex direction="column" gap={2}>
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            Filtros..., adicionar mercado, editar
          </Box>
        </Flex>
        <div className="rounded-frame">
          <PurchasesTable purchases={purchases} />
        </div>
      </Flex>
    </>
  );
}

export const getServerSideProps = async () => {
  const purchases = await prisma.purchase.findMany({
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
  });

  return { props: { purchases: JSON.parse(JSON.stringify(purchases)) } };
};

export default Purchases;
