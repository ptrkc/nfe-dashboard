import { prisma } from 'lib/prisma'

import Head from 'next/head'
import { Box, Button, FormLabel, Input } from '@chakra-ui/react'

const EditMarketForm = ({ market }) => (
  <Box>
    <FormLabel htmlFor="name">Name:</FormLabel>
    <Input name="name" id="name" value={market.name}disabled />
    <FormLabel htmlFor="nickname">Alias:</FormLabel>
    <Input name="nickname" id="nickname" />
    <Button>Save</Button>
  </Box>
)

const EditMarket = ({ market }) => (
  <>
    <Head>
      <title>NFe Dashboard | Add Market</title>
    </Head>
    <Box>
      <EditMarketForm market={market} />
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
      nickname: true,
    },
  })

  return {
    props: { market: JSON.parse(JSON.stringify(market)) }, // will be passed to the page component as props
  }
}

export default EditMarket
