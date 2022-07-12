import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import {
  FiMenu, FiHome, FiFile, FiShoppingCart, FiShoppingBag, FiPackage, FiTrendingUp, FiLock,
  FiUserPlus, FiFileText, FiX,
} from 'react-icons/fi';

import useBreakpoint from 'hooks/useBreakpoint';

const MAIN_OPTIONS = [
  { href: '/', text: 'Home', Icon: FiHome, disabled: false },
  { href: '/notas', text: 'Notas', Icon: FiFile, disabled: false },
  { href: '/mercados', text: 'Mercados', Icon: FiShoppingCart, disabled: false },
  { href: '/compras', text: 'Compras', Icon: FiShoppingBag, disabled: false },
  { href: '/produtos', text: 'Produtos', Icon: FiPackage, disabled: false },
  { href: '/graficos', text: 'Gráficos', Icon: FiTrendingUp, disabled: true },
];
const FOOTER_OPTIONS = [
  { href: '/login', text: 'Login', Icon: FiLock, disabled: true },
  { href: '/signup', text: 'Sign Up', Icon: FiUserPlus, disabled: true },
];

function SidebarLink({ toggleMenu, option: { href, Icon, text, disabled } }) {
  const { pathname } = useRouter();
  const isActive = pathname.split('/')[1] === href.substring(1);

  return (disabled ? (
    <button
      type="button"
      className="btn bg-blue-600 disabled:brightness-100 text-blue-400 flex items-center gap-2"
      disabled={disabled}
    >
      <Icon />
      {text}
    </button>
  ) : (
    <NextLink href={href} passHref>
      <button
        type="button"
        className={`btn ${isActive ? 'bg-blue-500' : 'bg-blue-600'} hover:bg-blue-500 flex w-full gap-2 items-center`}
        {...(toggleMenu && { onClick: toggleMenu })}
      >
        <Icon />
        {text}
      </button>
    </NextLink>
  ));
}

function SidebarContent({ toggleMenu }) {
  return (
    <div>
      <div className="flex flex-col gap-2 m-2">
        {MAIN_OPTIONS.map((option) => (
          <SidebarLink
            key={option.href}
            option={option}
            toggleMenu={toggleMenu}
          />
        ))}
      </div>
    </div>
  );
}

function SidebarFooter() {
  return (
    <div>
      <hr />
      <div className="flex flex-col gap-2 m-2">
        {FOOTER_OPTIONS.map((option) => (<SidebarLink key={option.href} option={option} />))}
      </div>
    </div>
  );
}

function Sidebar({ toggleMenu }) {
  return (
    <div className="bg-blue-600 w-52 text-gray-200 p-2 flex justify-between flex-col h-screen relative shrink-0">
      {toggleMenu && (
      <button
        className="btn-icon absolute right-1 top-1 hover:bg-blue-500"
        onClick={toggleMenu}
        type="button"
        aria-label="Close menu"
      >
        <FiX />
      </button>
      )}
      <div>
        <h1 className="text-center flex justify-center items-center">
          <FiFileText />
          NFe Dash
        </h1>
        <SidebarContent toggleMenu={toggleMenu} />
      </div>
      <SidebarFooter />
    </div>
  );
}

function TopBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [classes, setClasses] = useState({ container: 'w-0', sidebar: '-left-60', overlay: 'bg-transparent' });
  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen) {
      setClasses({ container: 'w-full right-0 ', sidebar: 'left-0', overlay: 'bg-black/50' });
    } else {
      setClasses({ container: 'w-full right-0 ', sidebar: '-left-60', overlay: 'bg-transparent' });
      setTimeout(() => {
        setClasses({ container: 'w-0', sidebar: '-left-60', overlay: 'bg-transparent' });
      }, 200);
    }
  }, [isOpen]);

  return (
    <div className="p-2 flex bg-white z-10 shadow-md relative">
      <button
        aria-label="Open menu"
        type="button"
        className="btn-icon btn-blue"
        onClick={toggleMenu}
      >
        <FiMenu />
      </button>
      <div
        className={`fixed top-0 bottom-0 left-0 h-screen ${classes.container}`}
      >
        <div className={`${classes.sidebar} absolute duration-200`}>
          <Sidebar toggleMenu={toggleMenu} />
        </div>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,
        jsx-a11y/no-static-element-interactions */}
        <div
          className={`${classes.overlay} h-screen duration-200 w-full`}
          onClick={toggleMenu}
        />
      </div>
    </div>
  );
}

export default function Layout({ children }) {
  const isDesktop = useBreakpoint('md');

  return (
    <div className="h-screen flex flex-col md:flex-row">
      {isDesktop ? <Sidebar /> : <TopBar />}
      <div className="w-full overflow-y-scroll p-4">{children}</div>
    </div>
  );
}
