import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Using the context we just made
import { TextInput, PasswordInput, Button, Paper, Title, Container, Select, Stack } from '@mantine/core';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', password: '', role: 'WORKER' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
      role: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      // 1. In production, call your FastAPI here:
      // const response = await apiClient.post('/auth/login', values);
      
      // 2. For now, we mock the successful response from your MSSQL/FastAPI
      const mockUser = { 
        id: '101', 
        name: 'Vijay', 
        role: values.role, 
        token: 'ey-your-jwt-token-from-fastapi' 
      };

      login(mockUser); // This updates the state globally

      // 3. Logic-based redirection
      if (values.role === 'WORKER') navigate('/worker');
      else if (values.role === 'ADMIN') navigate('/admin');
      else navigate('/client');
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