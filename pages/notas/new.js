import Head from 'next/head'
import { prisma } from 'lib/prisma'

const NewNotaForm = ({ markets }) => {
  const options = markets.map(market => ({ label: market.nickname || market.name, value: market.id }))
  return (
    <div className="flex flex-col bg-slate-200 max-w-lg mx-auto p-4">
      <label htmlFor="total">Total:</label>
      <input name="total" id="total" />
      <label htmlFor="markets">Choose a market:</label>
      <select name="markets" id="markets">
        {options.map(({ label, value }) => (<option key={value} value={value}>{label}</option>))}
      </select>
      <button>Add</button>
    </div>
  )
}

const NewNota = ({ markets }) => (
  <>
    <Head>
      <title>NFe Dashboard</title>
    </Head>
    <main>
      <NewNotaForm markets={markets} />
    </main>
  </>
)

export const getServerSideProps = async () => {
  const markets = await prisma.market.findMany({
    select: {
      id: true,
      name: true,
      nickname: true,
    },
  })

  return {
    props: { markets: JSON.parse(JSON.stringify(markets)) }, // will be passed to the page component as props
  }
}

export default NewNota
