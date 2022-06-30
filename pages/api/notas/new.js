import { prisma } from 'lib/prisma'
import * as cheerio from 'cheerio'

const toDecimal = number => parseFloat(number.replace(',', '.')) || null

const generatePrismaData = (receivedFile) => {
  const $ = cheerio.load(receivedFile)
  const receiptId = $('.box span').first().text().replace(/\s/g, '')
  const total = $('#NFe > fieldset:nth-child(1) > table > tbody > tr > td:nth-child(6) > span').text()
  const [day, month, year] = $(
    '#NFe fieldset:nth-child(1) td:nth-child(4) > span:nth-child(2)',
  ).text().slice(0, 10).split('/')
  const date = new Date(`${year}-${month}-${day}`)

  const marketName = $('#NFe > fieldset:nth-child(2) > table > tbody > tr > td.col-2 > span').text()
  const cnpj = $('#NFe > fieldset:nth-child(2) > table > tbody > tr > td:nth-child(1) > span').text()
  const cep = $('#Emitente > fieldset > table > tbody > tr:nth-child(3) > td:nth-child(2) > span').text()
  const marketId = `${cnpj}@${cep}`
  const fantasia = $('#Emitente > fieldset > table > tbody > tr.col-2 > td:nth-child(2) > span').text()
  const address = $(
    '#Emitente > fieldset > table > tbody > tr:nth-child(2) > td:nth-child(2) > span',
  ).text().replace(/\s{2,}/g, ' ')

  const pricePerUnit = $(
    'table.toggable > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(1) > span:nth-child(2)',
  ).map((_, element) => $(element).text()).toArray()
  const products = $(
    '#aba_nft_3 table.toggle.box .fixo-prod-serv-descricao',
  ).map((_, element) => $(element).text()).toArray()
  const quantity = $(
    '#aba_nft_3 table.toggle.box .fixo-prod-serv-qtd',
  ).map((_, element) => $(element).text()).toArray()
  const unities = $(
    '#aba_nft_3 table.toggle.box .fixo-prod-serv-uc',
  ).map((_, element) => $(element).text()).toArray()
  const regularPrices = $(
    '#aba_nft_3 table.toggle.box .fixo-prod-serv-vb',
  ).map((_, element) => $(element).text()).toArray()
  const discounts = $(
    'table.toggable > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(1) > span:nth-child(2)',
  ).map((_, element) => $(element).text()).toArray()
  const eans = $(
    'table.toggable > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > span:nth-child(2)',
  ).map((_, element) => $(element).text()).toArray().map(ean => (isNaN(parseInt(ean)) ? null : ean.replace(/^0+/, '')))

  const receipt = {
    id: receiptId,
    date,
    total: toDecimal(total),
    market: {
      connectOrCreate: {
        where: { id: marketId },
        create: {
          id: marketId,
          cnpj,
          cep,
          name: marketName,
          fantasia,
          address,
        },
      },
    },
    purchases: {
      createMany: {
        data: [],
      },
    },
  }
  for (let index = 0; index < products.length; index += 1) {
    receipt.purchases.createMany.data.push({
      name: products[index],
      ean: eans[index],
      quantity: toDecimal(quantity[index]),
      unit: unities[index],
      unitPrice: toDecimal(pricePerUnit[index]),
      regularPrice: toDecimal(regularPrices[index]),
      discount: toDecimal(discounts[index]),
      chargedPrice: !discounts[index]
        ? toDecimal(regularPrices[index])
        : (parseInt(regularPrices[index].replace(',', '')) - parseInt(discounts[index].replace(',', ''))) / 100,
      marketId,
    })
  }
  return receipt
}

// 46,78 Zona Sul Barra 3/4

const handler = async (req, res) => {
  const { method, body } = req

  if (method === 'POST') {
    const data = generatePrismaData(body.content)
    const isAdded = await prisma.receipt.findUnique({ where: { id: data.id } })
    if (isAdded) return res.status(400).json({ error: 'Nota já existe' })

    await prisma.receipt.create({ data })
    return res.status(204).json()
  }

  return res.status(504)
}

export default handler
