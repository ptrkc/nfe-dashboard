import { Box } from '@chakra-ui/react'

export const RoundedFrame = ({ children, ...props }) => (
  <Box
    borderRadius={10}
    overflow="scroll"
    borderWidth="1px"
    borderColor="inherit"
    transition=".2s"
    _hover={{
      borderColor: 'whiteAlpha.400',
    }}
    w="100%"
    {...props}
  >
    {children}
  </Box>
)
