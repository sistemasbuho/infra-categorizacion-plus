import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { PasswordInput } from '../components/ui/password-input';
import { login } from '../request/loginRequest';

type LoginForm = {
  username: string;
  password: string;
};

function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onLogin = handleSubmit((data) => {
    login(data);
  });

  return (
    <>
      <Flex
        minH={'100%'}
        background={'linear-gradient(to right, #24243e, #302b63, #0f0c29)'}
      >
        <Flex alignItems={'center'} justifyContent={'space-evenly'} w={'100%'}>
          <Flex
            alignSelf={'start'}
            flexDir={'column'}
            maxW={'xl'}
            gap={20}
            mt={'28'}
          >
            <Box>
              <Heading size={'7xl'} color={'gray.100'}>
                Módulo de
              </Heading>
              <Heading size={'7xl'} fontWeight={'bolder'} color={'green.400'}>
                Categorización
              </Heading>
            </Box>

            <Text maxW={'md'} color={'gray.100'}>
              Para comenzar a utilizar la aplicación primero inicie sesión, si
              aún no tiene un usuario por favor contacte al equipo de tecnología
            </Text>
          </Flex>
          <Box p={8} rounded={'md'} bg={'gray.100'}>
            <form id="login" onSubmit={onLogin}>
              <Flex flexDir={'column'} gap={4} w={'xs'}>
                <Field.Root invalid={!!errors.username}>
                  <Field.Label>Nombre</Field.Label>
                  <Input
                    p={2}
                    type="text"
                    {...register('username', {
                      required: 'El nombre no puede estar vacío',
                    })}
                  />

                  <Field.ErrorText>{errors?.username?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.password}>
                  <Field.Label>Contaseña</Field.Label>
                  <PasswordInput
                    p={2}
                    {...register('password', {
                      required: 'La contraseña no es válida',
                    })}
                  />

                  <Field.ErrorText>{errors?.password?.message}</Field.ErrorText>
                </Field.Root>
                <Button
                  type="submit"
                  form="login"
                  p={2}
                  w={'100%'}
                  bg={'green.400'}
                  color={'blackAlpha.700'}
                  onClick={onLogin}
                >
                  iniciar sesión
                </Button>
              </Flex>
            </form>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}

export default Home;
