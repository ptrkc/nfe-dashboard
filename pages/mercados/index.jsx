import prisma from 'lib/prisma';

import { useMemo } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
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
        {rows.map(({ original: row }) => (
          <tr key={row.id}>
            <td>
              <NextLink passHref href={`/mercados/${encodeURIComponent(row.id)}`}>
                <a>{row.name}</a>
              </NextLink>
            </td>
            <td>
              <NextLink passHref href={`/mercados/${encodeURIComponent(row.id)}`}>
                <a>{row.fantasia}</a>
              </NextLink>
            </td>
            <td>
              <NextLink passHref href={`/mercados/${encodeURIComponent(row.id)}`}>
                <a>{row.nickname}</a>
              </NextLink>
            </td>
            <td>
              <NextLink passHref href={`/mercados/${encodeURIComponent(row.id)}`}>
                <a>{row.address}</a>
              </NextLink>
            </td>
            <td className="text-right">
              <NextLink passHref href={`/mercados/${encodeURIComponent(row.id)}`}>
                <a>{row.totalReceipts}</a>
              </NextLink>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Markets({ markets }) {
  return (
    <>
      <Head>
        <title>💸 NFe Dashboard | Mercados</title>
      </Head>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div>
            Filtros..., adicionar mercado, editar
          </div>
        </div>
        <div className="rounded-frame">
          <MarketsTable markets={markets} />
        </div>
      </div>
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
