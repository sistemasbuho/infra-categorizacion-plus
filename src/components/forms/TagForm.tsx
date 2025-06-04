import { Button, Field, Flex, Input } from '@chakra-ui/react';
import { IoSaveSharp } from 'react-icons/io5';
import { useForm } from 'react-hook-form';
import { LocalTag, TagResponse } from '../../context/TagContext';

type Props = {
  defaultValue?: TagResponse;
  confirmEvent: (data: TagResponse) => void;
  formId: string;
};

function TagForm({ defaultValue, confirmEvent, formId }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LocalTag>({ defaultValues: defaultValue ?? {} });

  const onSubmit = handleSubmit((data: TagResponse) => {
    confirmEvent(data);
  });

  return (
    <>
      <div className="w-full">
        <Flex flexDir={'column'} gap={4}>
          {/* formulario */}
          <form id={formId} onSubmit={onSubmit}>
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

            {/* <Field.Root invalid={!!errors.descripcion}>
              <Field.Label>Descripción</Field.Label>
              <Input p={2} {...register('descripcion')} />
              <Field.ErrorText>{errors?.descripcion?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.proyecto_id}>
              <Field.Label>Proyecto</Field.Label>
              <Input
                p={2}
                {...register('proyecto_id', {
                  required: 'El proyecto no puede estar vacío',
                })}
              />
              <Field.ErrorText>{errors?.proyecto_id?.message}</Field.ErrorText>
            </Field.Root> */}
          </form>
          <Button form={formId} type="submit" w="full" mt={4}>
            <IoSaveSharp />
            Guardar
          </Button>
        </Flex>
      </div>
    </>
  );
}

export default TagForm;
