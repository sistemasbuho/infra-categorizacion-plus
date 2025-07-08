import { ReactNode } from 'react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
  title: string;
  // onConfirmEvent: () => void;
  // onRejectEvent: () => void;
};

function AlertModal({ children, title, open, setOpen }: Props) {
  return (
    <></>
    // <Dialog.Root role="alertdialog" open={open} placement={'bottom'}>
    //   <Dialog.Backdrop
    //     onClick={(e) => {
    //       e.stopPropagation();
    //       e.preventDefault();
    //     }}
    //   />
    //   <Dialog.Positioner
    //     onClick={(e) => {
    //       e.stopPropagation();
    //       e.preventDefault();
    //     }}
    //   >
    //     <Dialog.Content p={10} mb={4}>
    //       <Dialog.Header>
    //         <Dialog.Title mb={4}>{title}</Dialog.Title>
    //       </Dialog.Header>
    //       <Dialog.Body>{children}</Dialog.Body>
    //       <br />
    //       {/* <Dialog.Footer>
    //         <Dialog.ActionTrigger asChild>
    //           <Button
    //             p={4}
    //             variant="outline"
    //             onClick={(e) => {
    //               e.stopPropagation();
    //               e.preventDefault();

    //               onRejectEvent();
    //               setOpen(false);
    //             }}
    //           >
    //             Cancelar
    //           </Button>
    //         </Dialog.ActionTrigger>
    //         <Button

    //           p={4}
    //           colorPalette="red"
    //           onClick={(e) => {
    //             e.stopPropagation();
    //             e.preventDefault();

    //             onConfirmEvent();
    //             setOpen(false);
    //           }}
    //         >
    //           Eliminar
    //         </Button>
    //       </Dialog.Footer> */}
    //       <Dialog.CloseTrigger asChild onClick={() => setOpen(false)}>
    //         <CloseButton size="sm" />
    //       </Dialog.CloseTrigger>
    //     </Dialog.Content>
    //   </Dialog.Positioner>
    // </Dialog.Root>
  );
}

export default AlertModal;
