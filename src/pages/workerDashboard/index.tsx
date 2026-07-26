import { Container, Title, Text, Paper, Badge, Group, Stack, Button, Alert, Card, SimpleGrid, Tabs } from '@mantine/core';
import { IconAlertCircle, IconCalendar, IconMapPin, IconClock, IconPlayerPlay } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getMockTasks, saveMockTasks } from '../../data/mockData';
import type { Task } from '../../types';

export function WorkerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(getMockTasks());
  }, []);

  const availableTasks = useMemo(() => tasks.filter((task) => task.status === 'PENDING'), [tasks]);
  const assignedTasks = useMemo(() => tasks.filter((task) => task.worker_id === user?.id?.toString() || task.status === 'ACCEPTED' || task.status === 'IN_PROGRESS'), [tasks, user?.id]);

  const handleAcceptTask = (taskId: string) => {
    const updated: Task[] = tasks.map((task) =>
      task.id === taskId ? { ...task, status: 'ACCEPTED', worker_id: user?.id?.toString() } : task,
    );
    setTasks(updated);
    saveMockTasks(updated);
  };

  const handleStartShift = (taskId: string) => {
    navigate(`/worker/shift/${taskId}`);
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={2}>Caregiver Portal</Title>
          <Badge size="lg" color={user?.is_verified ? 'green' : 'orange'}>
            {user?.is_verified ? 'Verified Professional' : 'Pending Verification'}
          </Badge>
        </Group>

        {!user?.is_verified && (
          <Alert variant="light" color="orange" title="Verification Required" icon={<IconAlertCircle />}>
            Your documents are being reviewed by the SafeStay Admin. You can still explore the demo workflow and complete the check-in experience.
          </Alert>
        )}

        <Paper withBorder p="md" radius="md">
          <Text size="sm" c="dimmed">Welcome back,</Text>
          <Text size="xl" fw={700}>{user?.name}</Text>
          <Text size="xs" mt={4}>Role: {user?.role} | Demo ID: #{user?.id}</Text>
        </Paper>

        <Alert color="blue" title="Reminder" icon={<IconClock />}>
          Please upload a photo or status note after each patient visit so the family receives a live update.
        </Alert>

        <Tabs defaultValue="available">
          <Tabs.List>
            <Tabs.Tab value="available">Available Jobs</Tabs.Tab>
            <Tabs.Tab value="assigned">My Assignments</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="available" pt="md">
            <Title order={3} mb="md">Available Care Requests in Chennai</Title>
            {availableTasks.length > 0 ? (
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                {availableTasks.map((task) => (
                  <Card key={task.id} withBorder shadow="sm" radius="md" p="lg">
                    <Stack gap="xs">
                      <Badge color="orange" variant="light">New Request</Badge>
                      <Text fw={700} size="lg">{task.title}</Text>
                      <Text size="sm" c="dimmed" lineClamp={2}>{task.description}</Text>
                      <Group gap="xs" mt="md">
                        <IconMapPin size={16} color="gray" />
                        <Text size="xs" c="dimmed">{task.location}</Text>
                      </Group>
                      <Text size="xs" c="dimmed" mt="xs">Patient: {task.patient_name} • Fee: ₹{task.fee}</Text>
                      {task.documents && task.documents.length > 0 && (
                        <Paper bg="blue.0" p="xs" radius="sm" mt="xs">
                          <Text size="xs" fw={500}>Patient documents:</Text>
                          {task.documents.map((doc) => <Text key={doc} size="xs" c="blue.9">• {doc}</Text>)}
                        </Paper>
                      )}
                      <Button fullWidth mt="md" color="blue" onClick={() => handleAcceptTask(task.id)}>Accept Job</Button>
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>
            ) : (
              <Paper withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
                <IconCalendar size={48} stroke={1.5} color="gray" />
                <Text fw={500} mt="md">No new requests nearby.</Text>
              </Paper>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="assigned" pt="md">
            <Title order={3} mb="md">My Assigned Tasks</Title>
            {assignedTasks.length > 0 ? (
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                {assignedTasks.map((task) => (
                  <Card key={task.id} withBorder shadow="sm" radius="md" p="lg">
                    <Stack gap="xs">
                      <Badge color={task.status === 'ACCEPTED' ? 'cyan' : 'green'} variant="light">{task.status}</Badge>
                      <Text fw={700} size="lg">{task.title}</Text>
                      <Text size="sm" c="dimmed" lineClamp={2}>{task.description}</Text>
                      <Group gap="xs" mt="md">
                        <IconMapPin size={16} color="gray" />
                        <Text size="xs" c="dimmed">{task.location}</Text>
                      </Group>
                      <Text size="xs" c="dimmed" mt="xs">Latest update: {task.latest_update}</Text>
                      {(task.status === 'ACCEPTED' || task.status === 'IN_PROGRESS') && (
                        <Button fullWidth mt="md" color="green" leftSection={<IconPlayerPlay size={16} />} onClick={() => handleStartShift(task.id)}>
                          Start Care Session
                        </Button>
                      )}
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>
            ) : (
              <Paper withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
                <IconCalendar size={48} stroke={1.5} color="gray" />
                <Text fw={500} mt="md">No assigned tasks yet.</Text>
              </Paper>
            )}
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
