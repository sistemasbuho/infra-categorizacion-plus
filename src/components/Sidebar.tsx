import { Box, Flex } from '@chakra-ui/react';
import { useColorModeValue } from './ui/color-mode';
import { ReactNode } from 'react';
import DrawerSidebar from './layout/DrawerSidebar';

export default function Sidebar({
  children,
}: {
  children: ReactNode;
  // headerContent: ReactNode;
}) {
  return (
    <Flex
      bg={useColorModeValue('white', 'black')}
      flexDir={'column'}
      height={'100vh '}
      w={'100%'}
      overflow={'hidden'}
    >
      {/* Navbar */}

      <Flex px={5}>
        <DrawerSidebar />
      </Flex>

      <Box height={'100%'} overflow={'auto'}>
        {children}
      </Box>
    </Flex>
  );
}
