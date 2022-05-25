import Head from 'next/head'
import { prisma } from 'lib/prisma'

const EditMarketForm = ({ market }) => (
  <div className="flex flex-col bg-slate-200 max-w-lg mx-auto p-4">
    <label htmlFor="name">Name:</label>
    <input name="name" id="name" value={market.name}disabled />
    <label htmlFor="nickname">Alias:</label>
    <input name="nickname" id="nickname" />
    <button>Save</button>
  </div>
)

const EditMarket = ({ market }) => (
  <>
    <Head>
      <title>NFe Dashboard | Add Market</title>
    </Head>
    <main>
      <EditMarketForm market={market} />
    </main>
  </>
)

export const getServerSideProps = async ({ query }) => {
  const { id } = query
  const market = await prisma.market.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      nickname: true,
    },
  })

  return {
    props: { market: JSON.parse(JSON.stringify(market)) }, // will be passed to the page component as props
  }
}

export default EditMarket
