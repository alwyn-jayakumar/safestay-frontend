import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { TextInput, PasswordInput, Button, Paper, Title, Container, Select, Stack } from '@mantine/core';
import { getDemoUser } from '../data/mockData';


export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', password: '', role: 'WORKER' as 'WORKER' | 'CLIENT' | 'ADMIN' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
      role: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      const demoUser = getDemoUser(values.role);
      login({
        ...demoUser,
        token: 'demo-token',
      });

      if (values.role === 'ADMIN') navigate('/admin');
      else if (values.role === 'WORKER') navigate('/worker');
      else if (values.role === 'CLIENT') navigate('/client');
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
            <p>Don't have an account? <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/signup')}>Register</span></p>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}