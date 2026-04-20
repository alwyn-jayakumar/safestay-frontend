import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Paper, 
  Title, 
  Container, 
  Select, 
  Stack, 
  Text, 
  Anchor,
  FileInput,
  Divider,
  Group
} from '@mantine/core';
import { 
  IconFingerprint, 
  IconFileCv, 
  IconPhoto, 
  IconUser, 
  IconAt, 
  IconLock, 
  IconMapPin 
} from '@tabler/icons-react';
import { usePost } from '../../hooks/useApi';

// Validation Schema using Yup
const SignupSchema = Yup.object().shape({
  fullName: Yup.string().min(3, 'Name too short').required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Password must be 6+ characters').required('Required'),
  role: Yup.string().required('Required'),
  // Worker-only validation (Conditional)
  aadhaarNumber: Yup.string().when('role', {
    is: 'WORKER',
    then: (schema) => schema.matches(/^[0-9]{12}$/, 'Aadhaar must be 12 digits').required('Aadhaar required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  idProofFile: Yup.mixed().when('role', {
    is: 'WORKER',
    then: (schema) => schema.required('Please upload ID proof'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export function Signup() {
  const navigate = useNavigate();
  const { execute: register, loading } = usePost('/auth/signup');

  const formik = useFormik({
    initialValues: { 
      fullName: '', 
      email: '', 
      password: '', 
      role: 'WORKER',
      location: '',
      aadhaarNumber: '',
      idProofFile: null as File | null,
      profilePic: null as File | null,
    },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      // For File Uploads, we MUST use FormData
      const formData = new FormData();
      formData.append('fullName', values.fullName);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('role', values.role);

      if (values.role === 'WORKER') {
        formData.append('location', values.location);
        formData.append('aadhaar', values.aadhaarNumber);
        if (values.idProofFile) formData.append('id_file', values.idProofFile);
        if (values.profilePic) formData.append('profile_file', values.profilePic);
      }

      try {
        await register(formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("Registration Successful! Admin will review your ID.");
        navigate('/login');
      } catch (err) {
        alert("Registration failed: " + err);
      }
    },
  });

  return (
    <Container size={460} my={40}>
      <Paper withBorder shadow="md" p={30} radius="md">
        <Title ta="center" order={2} c="blue.7" fw={900}>SafeStay Registration</Title>
        <Text c="dimmed" size="sm" ta="center" mt={5} mb={25}>
          Enter your details to create an account
        </Text>

        <form onSubmit={formik.handleSubmit}>
          <Stack>
            <Select
              label="Join as"
              data={[
                { value: 'WORKER', label: 'Caregiver (Worker)' },
                { value: 'CLIENT', label: 'Family (Client)' },
              ]}
              value={formik.values.role}
              onChange={(val) => formik.setFieldValue('role', val)}
            />

            <TextInput
              label="Full Name"
              placeholder="Full Name"
              leftSection={<IconUser size={16} />}
              {...formik.getFieldProps('fullName')}
              error={formik.touched.fullName && formik.errors.fullName}
            />

            <TextInput
              label="Email"
              placeholder="your@email.com"
              leftSection={<IconAt size={16} />}
              {...formik.getFieldProps('email')}
              error={formik.touched.email && formik.errors.email}
            />

            <PasswordInput
              label="Password"
              placeholder="Strong password"
              leftSection={<IconLock size={16} />}
              {...formik.getFieldProps('password')}
              error={formik.touched.password && formik.errors.password}
            />

            {/* WORKER SPECIFIC KYC FIELDS */}
            {formik.values.role === 'WORKER' && (
              <Stack gap="sm">
                <Divider my="xs" label="Identity Verification (KYC)" labelPosition="center" />
                
                <TextInput
                  label="Area Location"
                  placeholder="e.g. Kolathur, Chennai"
                  leftSection={<IconMapPin size={16} />}
                  {...formik.getFieldProps('location')}
                />

                <TextInput
                  label="Aadhaar Number"
                  placeholder="12 Digit Aadhaar"
                  leftSection={<IconFingerprint size={16} />}
                  {...formik.getFieldProps('aadhaarNumber')}
                  error={formik.touched.aadhaarNumber && formik.errors.aadhaarNumber}
                />

                <Group grow>
                  <FileInput
                    label="ID Proof Photo"
                    placeholder="Upload ID"
                    leftSection={<IconFileCv size={16} />}
                    accept="image/png,image/jpeg"
                    onChange={(file) => formik.setFieldValue('idProofFile', file)}
                    error={formik.touched.idProofFile && formik.errors.idProofFile}
                  />
                  
                  <FileInput
                    label="Profile Photo"
                    placeholder="Your Face"
                    leftSection={<IconPhoto size={16} />}
                    accept="image/png,image/jpeg"
                    onChange={(file) => formik.setFieldValue('profilePic', file)}
                    error={formik.touched.profilePic && formik.errors.profilePic}
                  />
                </Group>
              </Stack>
            )}

            <Button type="submit" fullWidth mt="xl" size="md" loading={loading}>
              Register Account
            </Button>
          </Stack>
        </form>

        <Text ta="center" mt="md" size="sm">
          Already have an account?{' '}
          <Anchor component={Link} to="/login" fw={700}>
            Sign in
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}