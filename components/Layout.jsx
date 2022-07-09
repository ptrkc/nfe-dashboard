import { useRef } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import {
  Box, Divider, Drawer, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex,
  Icon, IconButton, useBreakpointValue, useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import {
  FiHome, FiFile, FiShoppingCart, FiShoppingBag, FiPackage, FiTrendingUp, FiLock, FiUserPlus,
  FiFileText,
} from 'react-icons/fi';

const MAIN_OPTIONS = [
  { href: '/', text: 'Home', icon: FiHome, disabled: false },
  { href: '/notas', text: 'Notas', icon: FiFile, disabled: false },
  { href: '/mercados', text: 'Mercados', icon: FiShoppingCart, disabled: false },
  { href: '/compras', text: 'Compras', icon: FiShoppingBag, disabled: false },
  { href: '/produtos', text: 'Produtos', icon: FiPackage, disabled: false },
  { href: '/graficos', text: 'Gráficos', icon: FiTrendingUp, disabled: true },
];
const FOOTER_OPTIONS = [
  { href: '/login', text: 'Login', icon: FiLock, disabled: true },
  { href: '/signup', text: 'Sign Up', icon: FiUserPlus, disabled: true },
];

function SidebarLink({ option: { href, icon, text, disabled } }) {
  const { pathname } = useRouter();
  const isActive = pathname.split('/')[1] === href.substring(1);

  return (disabled ? (
    <button
      type="button"
      className="btn bg-blue-600 disabled:brightness-100 text-blue-400 flex items-center gap-2"
      disabled={disabled}
    >
      <Icon as={icon} />
      {text}
    </button>
  ) : (
    <NextLink href={href} passHref>
      <button
        type="button"
        className={`btn ${isActive ? 'bg-blue-500' : 'bg-blue-600'} hover:bg-blue-500 flex w-full gap-2 items-center`}
      >
        <Icon as={icon} />
        {text}
      </button>
    </NextLink>
  ));
}

function SidebarContent() {
  return (
    <Box>
      <Flex direction="column" gap={2} m={2}>
        {MAIN_OPTIONS.map((option) => (<SidebarLink key={option.href} option={option} />))}
      </Flex>
    </Box>
  );
}

function SidebarFooter() {
  return (
    <Box>
      <Divider />
      <Flex direction="column" gap={2} m={2}>
        {FOOTER_OPTIONS.map((option) => (<SidebarLink key={option.href} option={option} />))}
      </Flex>
    </Box>
  );
}

function Sidebar() {
  return (
    <div className="bg-blue-600 w-60 text-gray-200 p-2 flex justify-between flex-col">
      <div>
        <h1 className="text-center flex justify-center items-center">
          <Icon as={FiFileText} />
          NFe Dash
        </h1>
        <SidebarContent />
      </div>
      <SidebarFooter />
    </div>
  );
}

function LeftDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

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
        <DrawerContent
          bg="blue.600"
          color="gray.200"
          onClick={onClose}
        >
          <DrawerCloseButton />
          <DrawerHeader>
            <Icon as={FiFileText} />
            NFe Dash
          </DrawerHeader>
          <Flex direction="column" justifyContent="space-between" h="100%" p={2}>
            <SidebarContent />
            <SidebarFooter />
          </Flex>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function TopBar() {
  return (
    <Flex
      p={2}
      bg="white"
      w="100%"
      zIndex={2}
      boxShadow="md"
      borderBottomWidth="1px"
    >
      <LeftDrawer />
    </Flex>
  );
}

export default function Layout({ children }) {
  const isDesktop = useBreakpointValue({ base: false, md: true });

  return (
    <div className="h-screen flex flex-col md:flex-row">
      {isDesktop ? <Sidebar /> : <TopBar />}
      <div className="w-full overflow-y-scroll p-4">{children}</div>
    </div>
  );
}
