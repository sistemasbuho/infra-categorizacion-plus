import { Flex, FlexProps, Icon } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { IconType } from 'react-icons';
import { useColorModeValue } from '../ui/color-mode';

interface SidebarItemProps extends FlexProps {
  icon: IconType;
  children: ReactNode;
}
export default function SidebarItem({
  icon,
  children,
  ...rest
}: SidebarItemProps) {
  return (
    <>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: useColorModeValue('black', 'white'),
          color: useColorModeValue('white', '#21232a'),
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </>
  );
}
