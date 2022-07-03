import { Box } from '@chakra-ui/react';

export default function RoundedFrame({ children, ...props }) {
  return (
    <Box
      bg="white"
      borderRadius="md"
      overflow="hidden"
      transition=".2s"
      boxShadow="rgba(48, 49, 51, 0.05) 0px 0px 1px 0px, rgba(48, 49, 51, 0.1) 0px 2px 4px 0px"
      _hover={{ boxShadow: 'md' }}
      w="100%"
      {...props}
    >
      {children}
    </Box>
  );
}
