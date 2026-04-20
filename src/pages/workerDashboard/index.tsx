import { useState, useEffect } from 'react';
import { 
  Container, Text, Button, Card, Badge, Stack, 
  Group, Timeline, ThemeIcon, Checkbox, Paper, Loader 
} from '@mantine/core';
import { IconScan, IconClock, IconMapPin, IconCheck } from '@tabler/icons-react';
import { Scanner } from '../../features/care/Scanner';
import { useFetch, usePut, usePost } from '../../hooks/useApi';
import type { CareTask } from '../../types';

export function WorkerDashboard() {
  const [showScanner, setShowScanner] = useState(false);
  
  // 1. Fetch tasks from FastAPI
  const { data: tasks, loading, refetch } = useFetch<CareTask[]>('/worker/tasks');
  
  // 2. Hooks for Actions
  const { execute: updateTask } = usePut<any>('/worker/update-task');
  const { execute: verifyVisit } = usePost<any>('/worker/verify-visit');

  const handleVerification = async (data: { qr: string; coords: { lat: number; lng: number } }) => {
    try {
      await verifyVisit({ 
        qr: data.qr, 
        latitude: data.coords.lat, 
        longitude: data.coords.lng 
      });
      alert("Check-in Verified by GPS!");
      setShowScanner(false);
      refetch(); // Refresh task list
    } catch (err) {
      alert("Verification Failed: You are not at the location.");
    }
  };

  const handleTaskToggle = async (taskId: number, currentStatus: boolean) => {
    try {
      await updateTask({ id: taskId, isCompleted: !currentStatus });
      refetch(); // Sync with MSSQL
    } catch (err) {
      alert("Failed to update task");
    }
  };

  if (loading) return <Container py="xl" ta="center"><Loader size="xl" /></Container>;

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <Title order={3}>My Duty</Title>
          <Badge color="green" variant="light" size="lg">Online</Badge>
        </Group>

        {/* Check-in Card */}
        <Card withBorder radius="md" p="xl" bg="blue.0">
          <Text fw={700} size="lg">Current Patient: Mr. Ramanathan</Text>
          <Group gap={5} c="dimmed" mb="md">
            <IconMapPin size={14} />
            <Text size="xs">Kolathur, Chennai</Text>
          </Group>

          {!showScanner ? (
            <Button 
              fullWidth size="md" 
              leftSection={<IconScan size={18} />} 
              onClick={() => setShowScanner(true)}
            >
              Start Session (Scan QR)
            </Button>
          ) : (
            <Scanner onVerified={handleVerification} />
          )}
        </Card>

        {/* Task List Section */}
        <Paper withBorder p="md" radius="md">
          <Text fw={700} mb="md">Daily Care Tasks</Text>
          <Stack>
            {tasks?.map((task) => (
              <Group key={task.id} justify="space-between" p="xs" className="border-b last:border-0">
                <Checkbox 
                  checked={task.isCompleted} 
                  onChange={() => handleTaskToggle(task.id, task.isCompleted)}
                  label={
                    <Stack gap={0}>
                      <Text size="sm" fw={500} td={task.isCompleted ? 'line-through' : 'none'}>
                        {task.title}
                      </Text>
                      <Text size="xs" c="dimmed">{task.timeSlot}</Text>
                    </Stack>
                  }
                />
                {task.isCompleted && <ThemeIcon color="green" variant="light" radius="xl" size="sm"><IconCheck size={12} /></ThemeIcon>}
              </Group>
            ))}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

import { Title } from '@mantine/core';