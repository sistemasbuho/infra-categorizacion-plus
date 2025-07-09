import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ColorModeButton } from '../../ui/color-mode';
import { useConfig } from '../../../shared/context/ConfigContext';
import { FaFont } from 'react-icons/fa';

const Config: React.FC = () => {
  const { fontSize, setFontSize } = useConfig();

  return (
    <></>
    // <div>
    //   <Heading size={'md'} mb={3}>
    //     Personalización
    //   </Heading>

    //   <Flex gap={2} flexDir={'column'}>
    //     <Flex justify={'space-between'} alignItems={'center'}>
    //       <Text>Tamaño letra</Text>

    //       <Flex gap={2} alignItems={'center'}>
    //         <Button
    //           onClick={() => setFontSize(fontSize - 2)}
    //           size={'sm'}
    //           variant={'outline'}
    //         >
    //           <FontAwesomeIcon icon={faMinus} />
    //         </Button>

    //         <IconButton variant={'plain'}>
    //           <FaFont />
    //         </IconButton>

    //         <Button
    //           onClick={() => setFontSize(fontSize + 2)}
    //           size={'sm'}
    //           variant={'outline'}
    //         >
    //           <FontAwesomeIcon icon={faPlus} />
    //         </Button>
    //       </Flex>
    //     </Flex>
    //     {/* <ToggleSwitch } /> */}
    //     <Flex justify={'space-between'} alignItems={'center'}>
    //       <Text>Modo oscuro</Text>
    //       <ColorModeButton />
    //     </Flex>
    //   </Flex>
    // </div>
  );
};

export default Config;
