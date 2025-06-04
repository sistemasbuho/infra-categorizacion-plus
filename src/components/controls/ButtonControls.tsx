import { Button } from '@chakra-ui/react';
import optionStyles from '../../assets/css/components/menu/options.module.css';

interface Props {
  form: string;
  reject?: {
    disabled?: boolean;
    text?: string;
    event?: () => void;
  };
  accept?: {
    disabled?: boolean;
    text?: string;
  };
}

function ButtonControls({ form, accept, reject }: Props) {
  return (
    <>
      <div className={optionStyles.controls}>
        <Button
          className={optionStyles.reject}
          disabled={reject?.disabled || false}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            reject?.event();
          }}
        >
          {reject?.text || 'Cancelar'}
        </Button>
        <Button
          form={form}
          type="submit"
          className={optionStyles.accept}
          disabled={accept?.disabled || false}
        >
          {accept?.text || 'Guardar'}
        </Button>
      </div>
    </>
  );
}

export default ButtonControls;
