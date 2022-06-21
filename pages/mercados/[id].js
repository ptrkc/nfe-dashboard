import { prisma } from 'lib/prisma'

import Head from 'next/head'
import { Box } from '@chakra-ui/react'
import { MarketTable } from 'components/MarketTable'

const EditMarket = ({ market }) => (
  <>
    <Head>
      <title>NFe Dashboard | Mercado</title>
    </Head>
    <Box overflow="hidden" borderWidth={1} borderColor="gray.700">
      <MarketTable market={market} />
    </Box>
  </>
)

export const getServerSideProps = async ({ query }) => {
  const { id } = query
  const market = await prisma.market.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      fantasia: true,
      cnpj: true,
      address: true,
      cep: true,
      nickname: true,
    },
  })

  return {
    props: { market: JSON.parse(JSON.stringify(market)) }, // will be passed to the page component as props
  }
}

export default EditMarket
