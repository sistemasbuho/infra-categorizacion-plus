import { Button, CloseButton, Drawer, Portal } from '@chakra-ui/react';
import { FaBars } from 'react-icons/fa';

import SidebarContent from './SidebarContent';

export default function DrawerSidebar() {
  return (
    <Drawer.Root placement={'start'} size={{ base: 'full', sm: 'xs' }}>
      <Drawer.Trigger asChild>
        <Button variant="plain">
          <FaBars />
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <SidebarContent />
            <Drawer.CloseTrigger asChild>
              <CloseButton />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
