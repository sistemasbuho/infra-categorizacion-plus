import { Accordion, Flex, Icon, Text } from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface ContainerProps {
  title: string;
  children: React.ReactNode;
  icon?: IconType;
}

function AcordeonItem({ children, title, icon }: ContainerProps) {
  return (
    <Accordion.Item value={title} p={4}>
      <Accordion.ItemTrigger>
        <Flex justifyContent={'space-between'} w={'full'}>
          <Flex gap={2} alignItems={'center'}>
            {icon && <Icon as={icon} />}
            <Text>{title}</Text>
          </Flex>
          <Accordion.ItemIndicator />
        </Flex>
      </Accordion.ItemTrigger>
      <Accordion.ItemContent>
        <Accordion.ItemBody>{children}</Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
}

export default AcordeonItem;
