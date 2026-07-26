import { Container, Title, Text, Group, Button, Stack, Card, Badge, Timeline } from '@mantine/core';
import { IconPlus, IconPhoto, IconCheck } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMockTasks, getMockUpdates } from '../../data/mockData';
import type { Task } from '../../types';

export function ClientDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [updates, setUpdates] = useState(getMockUpdates());

  useEffect(() => {
    setTasks(getMockTasks());
    setUpdates(getMockUpdates());
  }, []);

  return (
    <Container size="md" py="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Patient Care Monitor</Title>
          <Text size="sm" c="dimmed">Manage and track your care requests</Text>
        </div>
        <Button leftSection={<IconPlus size={18} />} color="teal" onClick={() => navigate('/client/create-request')}>
          New Care Request
        </Button>
      </Group>

      <Stack gap="lg">
        {tasks.map((task) => (
          <Card key={task.id} withBorder radius="md" p="lg">
            <Group justify="space-between">
              <div>
                <Text fw={700}>{task.title}</Text>
                <Text size="sm" c="dimmed">{task.description}</Text>
              </div>
              <Badge color={task.status === 'COMPLETED' ? 'green' : 'blue'}>{task.status}</Badge>
            </Group>
            <Text size="sm" mt="sm">Patient: {task.patient_name} • Fee: ₹{task.fee}</Text>
            <Text size="sm" c="dimmed">Latest caregiver note: {task.latest_update}</Text>
            <Group mt="md">
              <IconPhoto size={16} />
              <Text size="sm">Recent updates from caregiver are shown below.</Text>
            </Group>
          </Card>
        ))}

        <Card withBorder radius="md" p="lg">
          <Title order={4} mb="md">Live updates from caregiver</Title>
          <Timeline bulletSize={24} lineWidth={2}>
            {updates.map((update) => (
              <Timeline.Item key={update.id} bullet={<IconCheck size={12} />} title="Status update">
                <Text size="sm" mt={4}>{update.notes}</Text>
                <Text size="xs" c="dimmed">{new Date(update.createdAt).toLocaleString()}</Text>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      </Stack>
    </Container>
  );
}
