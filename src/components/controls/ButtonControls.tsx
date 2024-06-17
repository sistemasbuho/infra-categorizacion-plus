import optionStyles from '../../assets/css/components/menu/options.module.css';

interface Props {
  form: string;
  reject?: {
    disabled?: boolean;
    text?: string;
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
        <button
          className={optionStyles.reject}
          disabled={reject?.disabled || false}
        >
          {reject?.text || 'Cancelar'}
        </button>
        <button
          form={form}
          type="submit"
          className={optionStyles.accept}
          disabled={accept?.disabled || false}
        >
          {accept?.text || 'Guardar'}
        </button>
      </div>
    </>
  );
}

export default ButtonControls;
