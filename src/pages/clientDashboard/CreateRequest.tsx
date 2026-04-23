import { TextInput, Textarea, Button, Container, Title, Stack, Paper, Group } from '@mantine/core';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { usePost } from '../../hooks/useApi'; // Your existing hook
import { toast } from '../../utils/toaster';
import { IconArrowLeft, IconHeartHandshake } from '@tabler/icons-react';

export function CreateRequest() {
  const navigate = useNavigate();
  const { execute: postTask, loading } = usePost('/tasks/create');

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      location: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Please describe the service needed'),
      description: Yup.string().required('Details help caregivers prepare'),
      location: Yup.string().required('Location is required for pickup/visit'),
    }),
    onSubmit: async (values) => {
      try {
        await postTask(values);
        toast.success("Request Posted", "Your request is now visible to verified caregivers.");
        navigate('/client'); // Go back to dashboard to see it in the timeline
      } catch (err) {
        toast.error("Error", "Could not create request. Please try again.");
      }
    },
  });

  return (
    <Container size="sm" py="xl">
      <Button 
        variant="subtle" 
        leftSection={<IconArrowLeft size={16} />} 
        onClick={() => navigate('/client')}
        mb="lg"
      >
        Back to Dashboard
      </Button>

      <Paper withBorder shadow="md" p={30} radius="md">
        <Group mb="lg">
          <IconHeartHandshake size={28} color="teal" />
          <Title order={2}>Request a Caregiver</Title>
        </Group>

        <form onSubmit={formik.handleSubmit}>
          <Stack>
            <TextInput
              label="Service Title"
              placeholder="e.g., Post-Surgery Nursing, Elderly Companion"
              {...formik.getFieldProps('title')}
              error={formik.touched.title && formik.errors.title}
              required
            />

            <Textarea
              label="Description of Needs"
              placeholder="Explain medicine timings, food habits, or physical support required..."
              minRows={4}
              {...formik.getFieldProps('description')}
              error={formik.touched.description && formik.errors.description}
              required
            />

            <TextInput
              label="Patient's Location"
              placeholder="e.g., T. Nagar, Chennai"
              {...formik.getFieldProps('location')}
              error={formik.touched.location && formik.errors.location}
              required
            />

            <Button 
              type="submit" 
              fullWidth 
              size="md" 
              mt="md" 
              loading={loading}
              color="teal"
            >
              Post Request
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}