import { Stat } from '@chakra-ui/react';
import RoundedFrame from 'components/RoundedFrame';

export default function StatCard({ children }) {
  return (
    <RoundedFrame>
      <Stat pt={2} px={2}>
        {children}
      </Stat>
    </RoundedFrame>
  );
}