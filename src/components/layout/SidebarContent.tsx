import { Box, Flex, Text } from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';
import { userRoutes } from '../../routes';
import { Link } from 'react-router-dom';

import SidebarItem from './SidebarItem';

export default function SidebarContent() {
  return (
    <Box
      bg={useColorModeValue('gray.100', '#21232a')}
      w={{ base: 'full', sm: 'xs' }}
      h="full"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          Módulos
        </Text>
      </Flex>
      {userRoutes.map((link) => {
        return (
          <Link
            to={link.path}
            key={link.label}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <SidebarItem icon={link.icon}>{link.label}</SidebarItem>
          </Link>
        );
      })}
    </Box>
  );
}
