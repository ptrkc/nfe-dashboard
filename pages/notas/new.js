import { prisma } from 'lib/prisma'

import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import { Box, Button, FormControl, FormLabel, IconButton, Input, InputGroup, InputLeftAddon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, useDisclosure, VStack } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { useForm, Controller } from 'react-hook-form'
import { SlidingSegmentedControl } from 'components/SlidingSegmentedControl'
import { FileDropzone } from 'components/FileDropzone'

const newReceiptOptions = [{ label: 'File', value: 'file' }, { label: 'Manual', value: 'manual' }]

const sortBy = key => (prev, next) => {
  const prevValue = prev[key].toLowerCase()
  const nextValue = next[key].toLowerCase()
  if (prevValue < nextValue) return -1
  if (prevValue > nextValue) return 1
  return 0
}

const TotalInput = ({ register }) => {
  const onKeyDownCapture = (event) => {
    const input = event.target
    if (input.value.length < 5) {
      input.selectionStart = input.value.length
      input.selectionEnd = input.value.length
    }
  }
  const onChange = (event) => {
    const input = event.target
    const valueOnlyNumbers = input.value.replace(/\D/g, '').replace(/^0+/, '').padStart(3, '0')
    input.value = `${valueOnlyNumbers.slice(0, valueOnlyNumbers.length - 2)}.${valueOnlyNumbers.slice(-2)}`
  }
  return (
    <NumberInput
      as={InputGroup}
      name="total"
      id="total"
      aria-label="Total"
      precision={2}
      step={0.01}
      min={0}
      max={10000}
      defaultValue={0}
      format={val => val.replace('.', ',')}
      parse={val => val.replace(',', '.')}
    >
      <InputLeftAddon>
        R$
      </InputLeftAddon>
      <NumberInputField
        borderLeftRadius={0}
        onKeyDownCapture={onKeyDownCapture}
        onFocus={(event) => {
          const input = event.target
          input.selectionStart = input.value.length
          input.selectionEnd = input.value.length
        }}
        {...register('total', {
          onChange,
          shouldUnregister: true,
        })}
      />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  )
}

const MarketSelection = ({ register, setValue, options }) => {
  const [localOptions, setLocalOptions] = useState(options)
  const [isValid, setIsValid] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const modalFocusRef = useRef()

  useEffect(() => {
    if (!localOptions[0]?.selected) return

    setValue('market', localOptions[0].value)
  }, [localOptions, setValue])

  const onModalOpen = () => {
    setIsValid(false)
    onOpen()
  }
  const addMarket = (value) => {
    if (isValid) {
      setLocalOptions([
        {
          label: value,
          value: JSON.stringify({ name: value, id: `MRKT${Date.now()}` }),
          selected: true,
        },
        ...options,
      ])
      onClose()
    }
  }
  const onChange = event => setIsValid(event.target.value.length >= 3)
  const onKeyDown = event => (event.key === 'Enter') && addMarket(modalFocusRef.current.value)

  return (
    <>
      <InputGroup gap={2}>
        <Select
          name="market"
          id="market"
          placeholder="Escolha ou adicione"
          {...register('market', {
            shouldUnregister: true,
          })}
        >
          {localOptions.map(({ label, value }) => (<option key={value} value={value}>{label}</option>))}
        </Select>
        <IconButton icon={<AddIcon w={3} />} onClick={onModalOpen} />
      </InputGroup>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={modalFocusRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Novo mercado</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                placeholder="Walmart"
                ref={modalFocusRef}
                onChange={onChange}
                onKeyDown={onKeyDown}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter gap={3}>
            <Button
              colorScheme="blue"
              isDisabled={!isValid}
              onClick={() => addMarket(modalFocusRef.current.value)}
            >
              Adicionar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>

  )
}

const NewReceiptForm = ({ markets }) => {
  const [formType, setFormType] = useState('file')
  const thisYear = (new Date()).getFullYear()
  const { register, control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm()
  const options = markets.map(market => ({ label: market.nickname || market.name,
    value: JSON.stringify({ name: market.name, id: market.id }) }))
    .sort(sortBy('label'))

  const onSubmit = async (data) => {
    if (formType === 'file') {
      for (const { content } of data.files) {
        await fetch('/api/notas/new', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: formType, content }),
        })
      }
    } else {
      await fetch('/api/notas/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type: formType, total: data.total.replace(',', '.') }),
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack align="start" p={4} spacing={2}>
        <SlidingSegmentedControl
          options={newReceiptOptions}
          selectedValue={formType}
          setSelectedValue={setFormType}
        />
        {formType === 'file' ? (
          <FormControl isRequired>
            <FormLabel htmlFor="files">Arquivo HTML:</FormLabel>
            <Controller
              control={control}
              name="files"
              render={({ field: { value, onChange } }) => (
                <FileDropzone multiple value={value} onChange={onChange} />
              )}
              shouldUnregister
            />
          </FormControl>
        ) : (
          <>
            <FormControl isRequired>
              <FormLabel htmlFor="description">Descrição:</FormLabel>
              <InputGroup gap={2}>
                <Input
                  name="description"
                  id="description"
                  {...register('description', {
                    shouldUnregister: true,
                  })}
                />
              </InputGroup>
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="total">Total:</FormLabel>
              <TotalInput
                register={register}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="market">Mercado:</FormLabel>
              <MarketSelection register={register} setValue={setValue} options={options} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="date">Data:</FormLabel>
              <InputGroup gap={2}>
                <Input
                  name="date"
                  id="date"
                  type="date"
                  min="2021-01-01"
                  max={`${thisYear}-12-31`}
                  {...register('date', {
                    shouldUnregister: true,
                    min: '2021-01-01',
                    max: `${thisYear}-12-31`,
                  })}
                />
              </InputGroup>
            </FormControl>
          </>
        )}
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

const NewReceipt = ({ markets }) => (
  <>
    <Head>
      <title>NFe Dashboard | +Nota</title>
    </Head>
    <Box maxW="2xl" marginX="auto">
      <NewReceiptForm markets={markets} />
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
    props: { markets }, // will be passed to the page component as props
  }
}

export default NewReceipt
