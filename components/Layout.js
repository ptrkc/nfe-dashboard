import { Box, Button, Divider, Flex, Heading, Link } from '@chakra-ui/react'
import NextLink from 'next/link'

const SidebarLink = ({ option: { href, text, disabled } }) => {
  if (disabled) return (
    <Button as={Link} isDisabled={disabled}>
      <Flex justifyContent="flex-start" w="100%">
        {text}
      </Flex>
    </Button>
  )

  return (
    <NextLink href={href} passHref>
      <Button as={Link}>
        <Flex justifyContent="flex-start" w="100%">
          {text}
        </Flex>
      </Button>
    </NextLink>
  )
}

const Sidebar = () => {
  const mainOptions = [
    { href: '/notas', text: '🧾 Notas', disabled: false },
    { href: '/mercados', text: '🛒 Mercados', disabled: false },
    { href: '/graficos', text: '📊 Gráficos', disabled: true },
  ]
  const userOptions = [
    { href: '/login', text: '🏠 Login', disabled: true },
    { href: '/signup', text: '🌱 Sign Up', disabled: true },
  ]
  return (
    <Flex bg="blackAlpha.700" w="xs" color="white" p="2" justifyContent="space-between" flexDirection="column">
      <Box>
        <Heading as="h1" textAlign="center">
          NFe Dash
        </Heading>
        <Divider />
        <Flex direction="column" gap="2" m="2">
          {mainOptions.map(option => (<SidebarLink key={option.href} option={option} />))}
        </Flex>
      </Box>
      <Box>
        <Divider />
        <Flex direction="column" gap="2" m="2">
          {userOptions.map(option => (<SidebarLink key={option.href} option={option} />))}
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
