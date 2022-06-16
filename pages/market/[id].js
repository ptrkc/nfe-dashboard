import { prisma } from 'lib/prisma'

import Head from 'next/head'
import { Box, Button, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react'

const EditMarketForm = ({ market }) => (
  <VStack align="start" spacing={2} borderRadius="10" boxShadow="md" p="4">
    <FormControl>
      <FormLabel htmlFor="name">Name:</FormLabel>
      <Input name="name" id="name" value={market.name}disabled />
    </FormControl>
    <FormControl>
      <FormLabel htmlFor="nickname">Alias:</FormLabel>
      <Input name="nickname" id="nickname" />
    </FormControl>
    <Button>Save</Button>
  </VStack>
)

const EditMarket = ({ market }) => (
  <>
    <Head>
      <title>NFe Dashboard | Add Market</title>
    </Head>
    <Box maxW="md" marginX="auto">
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
