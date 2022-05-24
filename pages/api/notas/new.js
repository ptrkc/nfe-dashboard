import {prisma} from '../../../lib/prisma' 
import * as cheerio from 'cheerio'

const toDecimal = (number) => parseFloat(number.replace(',','.')) || null

const generatePrismaData = (receivedFile) => {
    const $ = cheerio.load(receivedFile)
    const notaId = $('.box span').first().text().replace(/\s/g, '')
    const total = $('#NFe > fieldset:nth-child(1) > table > tbody > tr > td:nth-child(6) > span').text()
    const [day, month, year] = $('#NFe fieldset:nth-child(1) td:nth-child(4) > span:nth-child(2)').text().slice(0, 10).split('/')
    const date = new Date(`${year}-${month}-${day}`)

    const marketName = $('#NFe > fieldset:nth-child(2) > table > tbody > tr > td.col-2 > span').text()
    const cnpj = $('#NFe > fieldset:nth-child(2) > table > tbody > tr > td:nth-child(1) > span').text()
    const cep = $('#Emitente > fieldset > table > tbody > tr:nth-child(3) > td:nth-child(2) > span').text()
    const marketId = `${cnpj}@${cep}`
    const fantasia = $('#Emitente > fieldset > table > tbody > tr.col-2 > td:nth-child(2) > span').text()
    const address = $('#Emitente > fieldset > table > tbody > tr:nth-child(2) > td:nth-child(2) > span').text().replace(/\s{2,}/g, ' ')

    const rawPricesPerUnit = $(
      'table.toggable > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(1) > span:nth-child(2)'
    )
    const rawProducts = $('#aba_nft_3 table.toggle.box .fixo-prod-serv-descricao')
    const rawQuantities = $('#aba_nft_3 table.toggle.box .fixo-prod-serv-qtd')
    const rawUnities = $('#aba_nft_3 table.toggle.box .fixo-prod-serv-uc')
    const rawRegularPrices = $('#aba_nft_3 table.toggle.box .fixo-prod-serv-vb')
    const rawDiscounts = $(
      'table.toggable > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(1) > span:nth-child(2)'
    )
    const products = rawProducts.map((i, el) => $(el).text()).toArray()
    const quantity = rawQuantities.map((i, el) => $(el).text()).toArray()
    const unities = rawUnities.map((i, el) => $(el).text()).toArray()
    const pricePerUnit = rawPricesPerUnit.map((i, el) => $(el).text()).toArray()
    const regularPrices = rawRegularPrices.map((i, el) => $(el).text()).toArray()
    const discounts = rawDiscounts.map((i, el) => $(el).text()).toArray()

    const thisNota = {
      id: notaId,
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
        createMany:{
          data: []
        },
      },
    }
    for (let i = 0; i < products.length; i++) {
      thisNota.purchases.createMany.data.push({
        name: products[i],
        quantity: toDecimal(quantity[i]),
        unit: unities[i],
        unitPrice: toDecimal(pricePerUnit[i]),
        regularPrice: toDecimal(regularPrices[i]),
        discount: toDecimal(discounts[i]),
        chargedPrice: !discounts[i]
          ? toDecimal(regularPrices[i])
          : (parseInt(regularPrices[i].replace(',', '')) - parseInt(discounts[i].replace(',', ''))) / 100
          ,
        marketId,
      })
    }
    return thisNota
}

// 46,78 Zona Sul Barra 3/4


const handler = async (req, res) => {

  const {method, body } = req

  if(method === 'POST') {
    const data = generatePrismaData(body)
    const isAdded = await prisma.nota.findUnique({where: {id: data.id}})
    if(isAdded) return res.status(400).json({error: 'Nota já existe'})

    await prisma.nota.create({data})
    return res.status(204).json()
  }

  return res.status(504)
}

export default handler
