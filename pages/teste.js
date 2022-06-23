import { Box } from '@chakra-ui/react'
import * as cheerio from 'cheerio'

const Teste = () => {
  const $ = cheerio.load('<ul id="fruits">...</ul>')
  $.html()

  console.log($)
  return (
    <Box>sd</Box>
  )
}

export default Teste
