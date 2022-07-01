import { Box } from '@chakra-ui/react'

export const RoundedFrame = ({ children, ...props }) => (
  <Box
    bg="white"
    borderRadius="md"
    overflow="hidden"
    borderWidth="1px"
    borderColor="inherit"
    transition=".2s"
    boxShadow="sm"
    _hover={{
      boxShadow: 'md',
    }}
    w="100%"
    {...props}
  >
    {children}
  </Box>
)
