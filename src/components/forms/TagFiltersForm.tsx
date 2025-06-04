import { Button, Field, Flex, Input, VStack } from '@chakra-ui/react';
import { IoSaveSharp } from 'react-icons/io5';
import { useForm } from 'react-hook-form';

type Props = {
  /**
   * Valores por defecto para el formulario, este valor debe salir de los params de la URL
   */
  defaultValue?: TagFilters;
};

type TagFilters = {
  id?: string;
  nombre?: string;
  proyecto_id?: string;
  modified_at?: Date | string;
  created_at?: Date | string;
  modified_by?: string;
  created_by?: string;
};

function TagFiltersForm({ defaultValue }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TagFilters>({ defaultValues: defaultValue ?? {} });

  const onSubmit = handleSubmit((data: TagFilters) => {
    console.log(data);
  });

  return (
    <>
      <div className="w-full">
        <Flex flexDir={'column'} gap={4}>
          {/* formulario */}
          <form id="edit-tag" onSubmit={onSubmit}>
            <VStack display="flex" flexDir="column" gap={4}>
              {/* Nombre */}
              <Field.Root invalid={!!errors.nombre}>
                <Field.Label>Nombre</Field.Label>
                <Input p={2} {...register('nombre')} />

                <Field.ErrorText>{errors?.nombre?.message}</Field.ErrorText>
              </Field.Root>

              {/* Proyecto */}
              <Field.Root invalid={!!errors.proyecto_id}>
                <Field.Label>proyecto</Field.Label>
                <Input p={2} {...register('proyecto_id')} />

                <Field.ErrorText>
                  {errors?.proyecto_id?.message}
                </Field.ErrorText>
              </Field.Root>

              {/* Creado por */}
              <Field.Root invalid={!!errors.created_by}>
                <Field.Label>Creado por</Field.Label>
                <Input p={2} type="email" {...register('created_by')} />

                <Field.ErrorText>{errors?.created_by?.message}</Field.ErrorText>
              </Field.Root>

              {/* Modificado por */}
              <Field.Root invalid={!!errors.modified_by}>
                <Field.Label>Modifcado por</Field.Label>
                <Input p={2} type="email" {...register('modified_by')} />

                <Field.ErrorText>
                  {errors?.modified_by?.message}
                </Field.ErrorText>
              </Field.Root>

              {/* Creado  */}
              <Field.Root invalid={!!errors.created_at}>
                <Field.Label>Fecha de creación</Field.Label>
                <Input p={2} type="date" {...register('created_at')} />

                <Field.ErrorText>{errors?.created_at?.message}</Field.ErrorText>
              </Field.Root>

              {/* Modificado */}
              <Field.Root invalid={!!errors.modified_at}>
                <Field.Label>Fecha de modificación</Field.Label>
                <Input p={2} type="date" {...register('modified_at')} />

                <Field.ErrorText>
                  {errors?.modified_at?.message}
                </Field.ErrorText>
              </Field.Root>
            </VStack>
          </form>
          <Button form="edit-tag" type="submit" onSubmit={onSubmit}>
            <IoSaveSharp />
            Guardar
          </Button>
        </Flex>
      </div>
    </>
  );
}

export default TagFiltersForm;
