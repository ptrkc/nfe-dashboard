import { Box, Button, Divider, Flex, Heading, Link } from '@chakra-ui/react'
import NextLink from 'next/link'

const SidebarLink = ({ href, text }) => (
  <NextLink href={href} passHref>
    <Button as={Link}>
      <Flex justifyContent="flex-start" w="100%">
        {text}
      </Flex>
    </Button>
  </NextLink>
)

const Sidebar = () => {
  const mainOptions = [
    { href: '/notas', text: '🧾 Notas' },
    { href: '/mercados', text: '🛒 Mercados' },
    { href: '/graficos', text: '📊 Gráficos' },
  ]
  const userOptions = [
    { href: '/login', text: '🏠 Login' },
    { href: '/signup', text: '🌱 Sign Up' },
  ]
  return (
    <Flex bg="blue.500" w="xs" color="white" p="2" justifyContent="space-between" flexDirection="column">
      <Box>
        <Heading as="h1" textAlign="center">
          NFe Dash
        </Heading>
        <Divider />
        <Flex direction="column" gap="2" m="2">
          {mainOptions.map(option => (<SidebarLink key={option.href} href={option.href} text={option.text} />))}
        </Flex>
      </Box>
      <Box>
        <Divider />
        <Flex direction="column" gap="2" m="2" w="100%">
          {userOptions.map(option => (<SidebarLink key={option.href} href={option.href} text={option.text} />))}
        </Flex>
      </Box>
    </Flex>
  )
}

export const Layout = ({ children }) => (
  <Flex h="100vh">
    <Sidebar />
    <Box w="full" overflow="scroll" p="4">{children}</Box>
  </Flex>
)
