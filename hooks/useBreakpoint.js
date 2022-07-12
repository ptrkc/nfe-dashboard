import tailwindConfig from 'tailwind.config'; // Fix the path
import useMediaQuery from 'hooks/useMediaQuery';

export default function useBreakpoint(size) {
  return useMediaQuery(`(min-width: ${tailwindConfig.theme.screens[size]})`);
}
