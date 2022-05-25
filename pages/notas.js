import { useMemo } from 'react'
import { prisma } from 'lib/prisma'
import Head from 'next/head'
import { useTable, useSortBy } from 'react-table'

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
    prepareRow,
  } = useTable({ columns, data, initialState }, useSortBy)

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          // eslint-disable-next-line react/jsx-key
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              // eslint-disable-next-line react/jsx-key
              <th
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
        {rows.map((row) => {
          prepareRow(row)
          return (
            // eslint-disable-next-line react/jsx-key
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                // eslint-disable-next-line react/jsx-key
                <td
                  {...cell.getCellProps()}
                >
                  {cell.render('Cell')}
                </td>
              ))}
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
    <NotasTable notas={notas} />
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
      // purchases: true,
    },
  })

  return {
    props: { notas: JSON.parse(JSON.stringify(notas)) }, // will be passed to the page component as props
  }
}

export default Notas
