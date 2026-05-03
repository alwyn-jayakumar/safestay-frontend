import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Using the context we just made
import { TextInput, PasswordInput, Button, Paper, Title, Container, Select, Stack } from '@mantine/core';
import { usePost } from '../hooks/useApi';
export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { execute: loginRequest } = usePost('/auth/login');

  const formik = useFormik({
    initialValues: { email: '', password: '', role: 'WORKER' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
      role: Yup.string().required('Required'),
    }),
    // Inside Login.tsx
onSubmit: async (values) => {
  const response = await loginRequest(values);
  
  if (response) {
    // Combine token and user info into one object
    const authData = {
      ...response.user,           // id, name, role
      token: response.access_token // The JWT token
    };

    // 1. Update Context & LocalStorage
    login(authData);

    // 2. Navigate based on the FRESH role from the response
    const role = response.user.role;
    if (role === 'ADMIN') navigate('/admin');
    else if (role === 'WORKER') navigate('/worker');
    else if (role === 'CLIENT') navigate('/client');
  }
},
  });

  return (
    <Container size={420} my={80}>
      <Paper withBorder shadow="md" p={30} radius="md">
        <Title ta="center" order={2} mb="lg">SafeStay Login</Title>
        <form onSubmit={formik.handleSubmit}>
          <Stack>
            <Select
              label="User Role"
              placeholder="Pick one"
              data={[
                { value: 'WORKER', label: 'Caregiver (Worker)' },
                { value: 'CLIENT', label: 'Family (Client)' },
                { value: 'ADMIN', label: 'Administrator' },
              ]}
              // Use value and onChange manually for Mantine + Formik
              value={formik.values.role}
              onChange={(value) => formik.setFieldValue('role', value)}
              error={formik.touched.role && formik.errors.role}
            />
            <TextInput
              label="Email"
              {...formik.getFieldProps('email')}
              error={formik.touched.email && formik.errors.email}
            />
            <PasswordInput
              label="Password"
              {...formik.getFieldProps('password')}
              error={formik.touched.password && formik.errors.password}
            />
            <Button type="submit" fullWidth mt="md">Login</Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}