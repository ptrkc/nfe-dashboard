import { prisma } from 'lib/prisma'

import Head from 'next/head'
import { Box, Button, FormControl, FormLabel, Input, InputGroup, Select, VStack } from '@chakra-ui/react'

const NewNotaForm = ({ markets }) => {
  const options = markets.map(market => ({ label: market.nickname || market.name, value: market.id }))
  return (
    <VStack align="start" p={4} spacing={2} borderRadius="10" boxShadow="md">
      <FormControl>
        <FormLabel htmlFor="file">Arquivo HTML:</FormLabel>
        <Input
          name="file"
          id="file"
          type="file"
          aria-label="file"
          placeholder="nota.html"
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="total">Total:</FormLabel>
        <Input
          name="total"
          id="total"
          type="text"
          aria-label="Total"
          placeholder="Total"
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="markets">Choose a market:</FormLabel>
        <InputGroup>
          <Select
            name="markets"
            id="markets"
          >
            {options.map(({ label, value }) => (<option key={value} value={value}>{label}</option>))}
          </Select>
          <Button>+</Button>
        </InputGroup>
      </FormControl>
      <Button>Add</Button>
    </VStack>
  )
}

const NewNota = ({ markets }) => (
  <>
    <Head>
      <title>NFe Dashboard</title>
    </Head>
    <Box maxW="md" marginX="auto">
      <NewNotaForm markets={markets} />
    </Box>
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
