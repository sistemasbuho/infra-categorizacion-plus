import { CloseButton, Drawer, Portal } from '@chakra-ui/react';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  title?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

function DrawerModal({ children, title, open, setOpen }: Props) {
  return (
    <Drawer.Root
      open={open}
      size={{ base: 'full', md: 'md' }}
      closeOnInteractOutside={true}
      closeOnEscape={true}
      modal={true}
      onOpenChange={(details) => setOpen(details.open)}
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content p={4}>
            <Drawer.CloseTrigger onClick={() => setOpen(false)}>
              <CloseButton />
            </Drawer.CloseTrigger>
            <Drawer.Header mb={4}>
              <Drawer.Title>{title}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>{children}</Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}

export default DrawerModal;
