import { prisma } from 'lib/prisma'

import Head from 'next/head'
import { Box, Button, FormControl, FormLabel, IconButton, Input, InputGroup, Select, VStack } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { useForm } from 'react-hook-form'
import { FileDropzone } from 'components/FileDropzone'

const NewNotaForm = ({ markets }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const options = markets.map(market => ({ label: market.nickname || market.name, value: market.id }))
  const onSubmit = async (data) => {
    console.log({ errors, data })
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack align="start" p={4} spacing={2}>
        <FormControl>
          <FormLabel htmlFor="file">Arquivo HTML:</FormLabel>
          <FileDropzone multiple />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="total">Total:</FormLabel>
          <Input
            name="total"
            id="total"
            type="text"
            aria-label="Total"
            placeholder="Total"
            {...register('total')}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="market">Escolha o mercado:</FormLabel>
          <InputGroup gap={2}>
            <Select
              name="market"
              id="market"
              {...register('market')}
            >
              {options.map(({ label, value }) => (<option key={value} value={value}>{label}</option>))}
            </Select>
            <IconButton icon={<AddIcon w={3} />} />
          </InputGroup>
        </FormControl>
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          Adicionar
        </Button>
      </VStack>
    </form>
  )
}

const NewNota = ({ markets }) => (
  <>
    <Head>
      <title>NFe Dashboard | +Nota</title>
    </Head>
    <Box maxW="2xl" marginX="auto">
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
