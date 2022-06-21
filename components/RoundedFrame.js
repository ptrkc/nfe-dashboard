import { Box } from '@chakra-ui/react'

export const RoundedFrame = ({ children }) => (
  <Box borderRadius="10" overflow="scroll" borderWidth="1px" borderColor="gray.600" w="100%">
    {children}
  </Box>
)
