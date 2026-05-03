import { Container, Title, Text, Group, Button, Paper, Center, Loader } from '@mantine/core';
import { IconPlus, IconAlertCircle } from '@tabler/icons-react';
import { useFetch } from '../../hooks/useApi';
import { useNavigate } from 'react-router-dom';
import type { Task } from '../../types';

export function ClientDashboard() {
  const navigate = useNavigate();

  // Fetch client's tasks
  const { data: tasks, loading, error } = useFetch<Task[]>('/client/my-tasks');

  return (
    <Container size="md" py="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Patient Care Monitor</Title>
          <Text size="sm" c="dimmed">Manage and track your care requests</Text>
        </div>
        <Button
          leftSection={<IconPlus size={18}/>}
          color="teal"
          onClick={() => navigate('/client/create-request')}
        >
          New Care Request
        </Button>
      </Group>

      {loading ? (
        <Center py="xl"><Loader size="md" /></Center>
      ) : error ? (
        <Paper withBorder p="md" bg="red.0" c="red.9">
          <Group><IconAlertCircle /><Text>{error}</Text></Group>
        </Paper>
      ) : (
        <Paper withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
          <Text size="lg" fw={500}>Real-time care monitoring coming soon!</Text>
          <Text size="sm" c="dimmed" mt="md">
            This dashboard will show live updates from your caregiver's activities.
          </Text>
          <Text size="sm" c="dimmed">
            Tasks: {tasks?.length || 0} active requests
          </Text>
        </Paper>
      )}
    </Container>
  );
}
