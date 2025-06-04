import { Button, Field, Flex, Input, VStack } from '@chakra-ui/react';
import { LocalTema, TemaResponse } from '../../context/TemaContext';
import { IoSaveSharp } from 'react-icons/io5';
import { useForm } from 'react-hook-form';

type Props = {
  defaultValue?: TemaResponse;
  confirmEvent: (data: TemaResponse) => void;
};

function TemaForm({ defaultValue, confirmEvent }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LocalTema>({ defaultValues: defaultValue ?? {} });

  const onSubmit = handleSubmit((data: TemaResponse) => {
    console.log('datos', data);
    confirmEvent(data);
  });

  return (
    <>
      <div className="w-full">
        <Flex flexDir={'column'} gap={4}>
          {/* formulario */}
          <form id="edit-tema" onSubmit={onSubmit}>
            <VStack flexDir={'column'} gap={4}>
              <Field.Root invalid={!!errors.nombre}>
                <Field.Label>Nombre</Field.Label>
                <Input
                  p={2}
                  {...register('nombre', {
                    required: 'El nombre no puede estar vacío',
                  })}
                />

                <Field.ErrorText>{errors?.nombre?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.nombre}>
                <Field.Label>Descripción</Field.Label>
                <Input p={2} {...register('descripcion')} />

                <Field.ErrorText>{errors?.nombre?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.nombre}>
                <Field.Label>proyecto</Field.Label>
                <Input
                  p={2}
                  {...register('proyecto_id', {
                    required: 'El proyecto no puede estar vacío',
                  })}
                />

                <Field.ErrorText>{errors?.nombre?.message}</Field.ErrorText>
              </Field.Root>
            </VStack>
          </form>
          <Button form="edit-tema" type="submit">
            <IoSaveSharp />
            Guardar
          </Button>
        </Flex>
      </div>
    </>
  );
}

export default TemaForm;
