import { TextInput, Textarea, Button, Container, Title, Stack, Paper, Group, Select, Divider, Card, Text, Badge } from '@mantine/core';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { usePost } from '../../hooks/useApi';
import { toast } from '../../utils/toaster';
import { IconArrowLeft, IconHeartHandshake, IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import type{ TaskType } from '../../types';

interface InstructionForm {
  type: 'MEDICINE' | 'FOOD' | 'ACTIVITY';
  description: string;
  time_slot?: string;
  dosage?: string;
  frequency?: string;
}

export function CreateRequest() {
  const navigate = useNavigate();
  const { execute: postTask, loading } = usePost('/tasks/create');
  const [instructions, setInstructions] = useState<InstructionForm[]>([]);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      location: '',
      type: '' as TaskType,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Please describe the service needed'),
      description: Yup.string().required('Details help caregivers prepare'),
      location: Yup.string().required('Location is required for pickup/visit'),
      type: Yup.string().required('Please select the type of care needed'),
    }),
    onSubmit: async (values) => {
      try {
        const taskData = {
          ...values,
          medical_instructions: instructions,
        };
        await postTask(taskData);
        toast.success("Request Posted", "Your request is now visible to verified caregivers. A unique QR code has been generated for secure access.");
        navigate('/client');
      } catch (err) {
        toast.error("Error", "Could not create request. Please try again.");
      }
    },
    
  });

  const addInstruction = () => {
    setInstructions([...instructions, {
      type: 'MEDICINE',
      description: '',
      time_slot: '',
      dosage: '',
      frequency: '',
    }]);
  };

  const updateInstruction = (index: number, field: keyof InstructionForm, value: string) => {
    const updated = [...instructions];
    updated[index] = { ...updated[index], [field]: value };
    setInstructions(updated);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  return (
    <Container size="lg" py="xl">
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
            <Select
            label="Type of Care Needed"
            placeholder="Select care type"
            data={[
              { value: 'NURSING', label: 'Nursing Care' },
              { value: 'ELDERLY_CARE', label: 'Elderly Care' },
              { value: 'MEDICINE', label: 'Medicine Administration' },
              { value: 'FOOD', label: 'Food Assistance' },
              { value: 'CHECKUP', label: 'Health Checkup' },
            ]}
            value={formik.values.type}
            onChange={(value) => formik.setFieldValue('type', value)}
            error={formik.touched.type && formik.errors.type}
            required
          />

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

            <Divider my="lg" />

            <Group justify="space-between" align="center">
              <Title order={4}>Medical Instructions & Care Plan</Title>
              <Button
                variant="light"
                leftSection={<IconPlus size={16} />}
                onClick={addInstruction}
                size="sm"
              >
                Add Instruction
              </Button>
            </Group>

            <Text size="sm" c="dimmed">
              Add specific care instructions that will be shared with the assigned caregiver. These help ensure proper care delivery.
            </Text>

            {instructions.map((instruction, index) => (
              <Card key={index} withBorder p="md">
                <Stack>
                  <Group justify="space-between">
                    <Badge color="blue" size="sm">Instruction {index + 1}</Badge>
                    <Button
                      variant="subtle"
                      color="red"
                      size="xs"
                      leftSection={<IconTrash size={14} />}
                      onClick={() => removeInstruction(index)}
                    >
                      Remove
                    </Button>
                  </Group>

                  <Select
                    label="Type"
                    data={[
                      { value: 'MEDICINE', label: 'Medicine' },
                      { value: 'FOOD', label: 'Food' },
                      { value: 'ACTIVITY', label: 'Activity' },
                    ]}
                    value={instruction.type}
                    onChange={(value) => updateInstruction(index, 'type', value || 'MEDICINE')}
                  />

                  <Textarea
                    label="Description"
                    placeholder="Describe the medicine, food, or activity..."
                    value={instruction.description}
                    onChange={(e) => updateInstruction(index, 'description', e.target.value)}
                    required
                  />

                  <Group grow>
                    <TextInput
                      label="Time Slot"
                      placeholder="e.g., 9:00 AM"
                      value={instruction.time_slot}
                      onChange={(e) => updateInstruction(index, 'time_slot', e.target.value)}
                    />
                    <TextInput
                      label="Dosage/Frequency"
                      placeholder="e.g., 1 tablet, 3x daily"
                      value={instruction.dosage || instruction.frequency}
                      onChange={(e) => updateInstruction(index, 'dosage', e.target.value)}
                    />
                  </Group>
                </Stack>
              </Card>
            ))}

            {instructions.length === 0 && (
              <Text size="sm" c="dimmed" ta="center" py="md">
                No instructions added yet. Click "Add Instruction" to specify care requirements.
              </Text>
            )}

            <Button
              type="submit"
              fullWidth
              size="md"
              mt="xl"
              loading={loading}
              color="teal"
            >
              Post Request & Generate QR Code
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}