import { Box, Button, Divider, Drawer, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Heading,
  Link, useBreakpointValue, useDisclosure } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useRef } from 'react'

const MAIN_OPTIONS = [
  { href: '/', text: '🏠 Home', disabled: false },
  { href: '/notas', text: '🧾 Notas', disabled: false },
  { href: '/mercados', text: '🛒 Mercados', disabled: false },
  { href: '/compras', text: '🛍️ Compras', disabled: false },
  { href: '/produtos', text: '🥑 Produtos', disabled: false },
  { href: '/graficos', text: '📊 Gráficos', disabled: true },
]
const FOOTER_OPTIONS = [
  { href: '/login', text: '🔓 Login', disabled: true },
  { href: '/signup', text: '🌱 Sign Up', disabled: true },
]

const header = 'NFe Dash'

const SidebarLink = ({ option: { href, text, disabled } }) => {
  const { pathname } = useRouter()
  const isActive = pathname.split('/')[1] === href.substring(1)

  return (disabled ? (
    <Button as={Link} isDisabled={disabled}>
      <Flex justifyContent="flex-start" w="100%">
        {text}
      </Flex>
    </Button>
  ) : (
    <NextLink href={href} passHref>
      <Button as={Link} isActive={isActive}>
        <Flex justifyContent="flex-start" w="100%">
          {text}
        </Flex>
      </Button>
    </NextLink>
  ))
}

const SidebarContent = () => (
  <Box>
    <Divider />
    <Flex direction="column" gap="2" m="2">
      {MAIN_OPTIONS.map(option => (<SidebarLink key={option.href} option={option} />))}
    </Flex>
  </Box>
)

const SidebarFooter = () => (
  <Box>
    <Divider />
    <Flex direction="column" gap="2" m="2">
      {FOOTER_OPTIONS.map(option => (<SidebarLink key={option.href} option={option} />))}
    </Flex>
  </Box>
)

const Sidebar = () => (
  <Flex bg="gray.900" w="xs" color="white" p="2" justifyContent="space-between" flexDirection="column">
    <Box>
      <Heading as="h1" textAlign="center">
        {header}
      </Heading>
      <SidebarContent />
    </Box>
    <SidebarFooter />
  </Flex>
)

const LeftDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  return (
    <>
      <Button ref={btnRef} onClick={onOpen}>
        Open
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent bg="gray.900">
          <DrawerCloseButton />
          <DrawerHeader>{header}</DrawerHeader>
          <Flex direction="column" justifyContent="space-between" h="100%" p="2">
            <SidebarContent />
            <SidebarFooter />
          </Flex>
        </DrawerContent>
      </Drawer>
    </>
  )
}

const TopBar = () => (
  <Flex bg="gray.900">
    <LeftDrawer />
  </Flex>
)

export const Layout = ({ children }) => {
  const isDesktop = useBreakpointValue({ base: false, md: true })

  return (
    <Flex h="100vh" direction={{ base: 'column', md: 'row' }}>
      {isDesktop ? <Sidebar /> : <TopBar />}
      <Box w="full" overflow="scroll" p="4">{children}</Box>
    </Flex>
  )
}
