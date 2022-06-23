import { useRef } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { Box, Button, Divider, Drawer, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Heading,
  Icon, IconButton, Link, useBreakpointValue, useDisclosure } from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { FiHome, FiFile, FiShoppingCart, FiShoppingBag, FiPackage, FiTrendingUp, FiLock, FiUserPlus } from 'react-icons/fi'

const MAIN_OPTIONS = [
  { href: '/', text: 'Home', icon: FiHome, disabled: false },
  { href: '/notas', text: 'Notas', icon: FiFile, disabled: false },
  { href: '/mercados', text: 'Mercados', icon: FiShoppingCart, disabled: false },
  { href: '/compras', text: 'Compras', icon: FiShoppingBag, disabled: false },
  { href: '/produtos', text: 'Produtos', icon: FiPackage, disabled: false },
  { href: '/graficos', text: 'Gráficos', icon: FiTrendingUp, disabled: true },
]
const FOOTER_OPTIONS = [
  { href: '/login', text: 'Login', icon: FiLock, disabled: true },
  { href: '/signup', text: 'Sign Up', icon: FiUserPlus, disabled: true },
]

const header = 'NFe Dash'

const SidebarLink = ({ option: { href, icon, text, disabled } }) => {
  const { pathname } = useRouter()
  const isActive = pathname.split('/')[1] === href.substring(1)

  return (disabled ? (
    <Button variant="ghost" as={Link} isDisabled={disabled}>
      <Flex justifyContent="flex-start" w="100%" gap={2}>
        <Icon as={icon} />{text}
      </Flex>
    </Button>
  ) : (
    <NextLink href={href} passHref>
      <Button variant="ghost" as={Link} isActive={isActive}>
        <Flex justifyContent="flex-start" w="100%" gap={2}>
          <Icon as={icon} />{text}
        </Flex>
      </Button>
    </NextLink>
  ))
}

const SidebarContent = () => (
  <Box>
    <Divider />
    <Flex direction="column" gap={2} m={2}>
      {MAIN_OPTIONS.map(option => (<SidebarLink key={option.href} option={option} />))}
    </Flex>
  </Box>
)

const SidebarFooter = () => (
  <Box>
    <Divider />
    <Flex direction="column" gap={2} m={2}>
      {FOOTER_OPTIONS.map(option => (<SidebarLink key={option.href} option={option} />))}
    </Flex>
  </Box>
)

const Sidebar = () => (
  <Flex
    bg="#22272e"
    w="xs"
    color="white"
    p={2}
    justifyContent="space-between"
    flexDirection="column"
    borderRight="1px"
    borderRightWidth="1px"
    borderRightColor="inherit"
  >
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
      <IconButton size="md" aria-label="Open Sidebar" icon={<HamburgerIcon />} ref={btnRef} onClick={onOpen} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent bg="#22272e" onClick={onClose}>
          <DrawerCloseButton />
          <DrawerHeader>{header}</DrawerHeader>
          <Flex direction="column" justifyContent="space-between" h="100%" p={2}>
            <SidebarContent />
            <SidebarFooter />
          </Flex>
        </DrawerContent>
      </Drawer>
    </>
  )
}

const TopBar = () => (
  <Flex bg="#2d333b" p={2}>
    <LeftDrawer />
  </Flex>
)

export const Layout = ({ children }) => {
  const isDesktop = useBreakpointValue({ base: false, md: true })

  return (
    <Flex h="100vh" direction={{ base: 'column', md: 'row' }}>
      {isDesktop ? <Sidebar /> : <TopBar />}
      <Box w="full" overflowY="scroll" p={4}>{children}</Box>
    </Flex>
  )
}
