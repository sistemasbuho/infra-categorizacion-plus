import { faBook, faGear, faListUl } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaBars } from 'react-icons/fa';

import Categorization from './options/categorization/Categorization';
import Header from './options/Header';
import Config from './options/Config';

function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  // Event listener para manejar Ctrl+E
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Detectar Ctrl+E (o Cmd+E en Mac)
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') {
        event.preventDefault(); // Prevenir comportamiento por defecto del navegador

        // Verificar que no estemos escribiendo en un campo de texto
        const activeElement = document.activeElement;
        const isInputFocused =
          activeElement &&
          (activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA');

        if (!isInputFocused) {
          setIsOpen((prev) => !prev); // Toggle del drawer
        }
      }
    };

    // Agregar event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup: remover el event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      {/* <Drawer.Root
        size={'sm'}
        closeOnInteractOutside={false}
        open={isOpen}
        onOpenChange={({ open }) => setIsOpen(open)}
      >
        <Drawer.Trigger asChild>
          <Button variant="outline" p={2} size="sm">
            <FaBars />
            <Kbd> ctrl + b</Kbd>
          </Button>
        </Drawer.Trigger>
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Body p={4}>
              <Tabs.Root defaultValue="categorization" variant={'plain'}>
                <Flex
                  mb={2}
                  alignItems={'center'}
                  gap={2}
                  justifyContent={'space-between'}
                >
                  <Tabs.List
                    display={'flex'}
                    bg="bg.muted"
                    rounded="l3"
                    p="1"
                    gap={1}
                    mb={2}
                  >
                    <Tabs.Trigger p={2} value="encabezado">
                      <FontAwesomeIcon icon={faBook} />
                      <Text>Encabezado</Text>
                    </Tabs.Trigger>
                    <Tabs.Trigger p={2} value="categorization">
                      <FontAwesomeIcon icon={faListUl} />
                      <Text>Categorización</Text>
                    </Tabs.Trigger>
                    <Tabs.Trigger p={2} value="config">
                      <FontAwesomeIcon icon={faGear} />
                      <Text>Configuración</Text>
                    </Tabs.Trigger>
                    <Tabs.Indicator rounded="l2" />
                    <Drawer.CloseTrigger position="unset" inset="auto">
                      <CloseButton
                        size="md"
                        variant={'solid'}
                        colorPalette={'red'}
                      />
                    </Drawer.CloseTrigger>
                  </Tabs.List>
                </Flex>
                {/* content */}
                <Tabs.Content value="encabezado">
                  <Header />
                </Tabs.Content>
                <Tabs.Content value="categorization">
                  <Categorization />
                </Tabs.Content>
                <Tabs.Content value="config">
                  <Config />
                </Tabs.Content>
              </Tabs.Root>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root> */}
    </>
  );
}

export default Menu;
