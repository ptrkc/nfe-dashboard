import { prisma } from 'lib/prisma'
import * as cheerio from 'cheerio'

const toDecimal = number => parseFloat(number.replace(',', '.')) || null

const generatePrismaDataFromHTML = (receivedFile) => {
  const $ = cheerio.load(receivedFile)
  const receiptId = $('.box span').first().text().replace(/\s/g, '')
  const qrCode = $(
    '#Inf > fieldset:nth-child(1) > fieldset:nth-child(4) > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > span:nth-child(2)',
  ).text()
  const total = toDecimal($('#NFe > fieldset:nth-child(1) > table > tbody > tr > td:nth-child(6) > span').text())

  const [unformattedDate, unformattedTime] = $(
    '#NFe fieldset:nth-child(1) td:nth-child(4) > span:nth-child(2)',
  ).text().split(' ')
  const [day, month, year] = unformattedDate.split('/')
  const date = new Date(`${year}-${month}-${day}T${unformattedTime.slice(0, 8)}`)

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
    qrCode,
    total,
    filteredTotal: total,
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
      ean: eans[index] || null,
      quantity: toDecimal(quantity[index]),
      unit: unities[index],
      unitPrice: toDecimal(pricePerUnit[index]),
      regularPrice: toDecimal(regularPrices[index]),
      discount: toDecimal(discounts[index]) || null,
      chargedPrice: !discounts[index]
        ? toDecimal(regularPrices[index])
        : (parseInt(regularPrices[index].replace(',', '')) - parseInt(discounts[index].replace(',', ''))) / 100,
      marketId,
    })
  }
  return receipt
}

const generatePrismaDataFromForm = (body) => {
  const { date, total, market, description } = body
  const { name: marketName, id: marketId } = JSON.parse(market)
  return {
    id: `RCPT${Date.now()}`,
    date: new Date(date),
    total,
    filteredTotal: total,
    market: {
      connectOrCreate: {
        where: { id: marketId },
        create: {
          id: marketId,
          name: marketName,
        },
      },
    },
    purchases: {
      createMany: {
        data: [
          {
            name: description,
            ean: `PRDCT${Date.now()}`,
            quantity: 1,
            unit: 'UN',
            unitPrice: total,
            regularPrice: total,
            chargedPrice: total,
            marketId,
          },
        ],
      },
    },
  }
}

// 46,78 Zona Sul Barra 3/4

const handler = async (req, res) => {
  const { method, body } = req
  console.log(body)
  try {
    if (method === 'POST') {
      let data
      if (body.type === 'file') {
        const id = body.content.match(/[\d ]{54}/)[0].replaceAll(' ', '')
        const isAdded = await prisma.receipt.findUnique({ where: { id } })
        if (isAdded) return res.status(201).json({ status: 'alreadyAdded' })

        data = generatePrismaDataFromHTML(body.content)
      } else {
        data = generatePrismaDataFromForm(body)
      }

      await prisma.receipt.create({ data })
      return res.status(201).json({ status: 'added', id: data.id })
    }

    return res.status(501).end()
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}

export default handler
