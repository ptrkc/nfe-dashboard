import { useMemo } from 'react'
import { useTable, useSortBy } from 'react-table'
import Head from 'next/head'
import Link from 'next/link'
import { prisma } from 'lib/prisma'
import { formatBRL } from 'lib/formatBRL'
import { dateSlice } from 'lib/dateSlice'

const NotasTable = ({ notas }) => {
  const data = useMemo(() => notas, [notas])
  const columns = useMemo(
    () => [
      { Header: 'Chave de Acesso', accessor: 'id', disableSortBy: true },
      { Header: 'Mercado', accessor: 'market.name' },
      { Header: 'Data', accessor: 'date' },
      { Header: 'Total', accessor: 'total' },
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
    <table {...getTableProps()} className="border-collapse border border-slate-500 mx-auto">
      <thead>
        {headerGroups.map(headerGroup => (
          // eslint-disable-next-line react/jsx-key
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              // eslint-disable-next-line react/jsx-key
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                className="px-2"
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
        {rows.map(({ original: { id, market, date, total } }) => {
          const marketName = market.nickname || market.name
          return (
            <tr key={id} className="odd:bg-white even:bg-slate-100 hover:bg-slate-300">
              <td className="px-2 border border-slate-600 text-right">
                <Link href={`/notas/${id}`}>
                  <a className="block w-full h-full" title={id}>...{id.slice(-8)}</a>
                </Link>
              </td>
              <td className="px-2 border border-slate-600">
                <Link href={`/notas/${id}`}>
                  <a className="block w-full h-full">{marketName}</a>
                </Link>
              </td>
              <td className="px-2 border border-slate-600">
                <Link href={`/notas/${id}`}>
                  <a className="block w-full h-full">{dateSlice(date)}</a>
                </Link>
              </td>
              <td className="px-2 border border-slate-600 text-right">
                <Link href={`/notas/${id}`}>
                  <a className="block w-full h-full">{formatBRL(total)}</a>
                </Link>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const Notas = ({ notas }) => (
  <>
    <Head>
      <title>NFe Dashboard</title>
    </Head>
    <main>
      <NotasTable notas={notas} />
    </main>
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
