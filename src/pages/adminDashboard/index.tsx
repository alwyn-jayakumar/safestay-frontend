import { Container, Grid, Paper, Text, Group, Button, Title, Card } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useApi';
import { IconUsers, IconUserCheck, IconClock } from '@tabler/icons-react';

export function AdminDashboard() {
  const navigate = useNavigate();
  
  // 1. Fetch real summary data (We'll create this backend endpoint next)
  const { data: stats } = useFetch<any>('/admin/stats');
  

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="xl">
        <Title order={1}>Admin Command Center</Title>
        <Button color="blue" onClick={() => navigate('/admin/verify')}>
          Verify New Workers
        </Button>
      </Group>

      <Grid mb="xl">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder p="md" radius="md">
            <Group>
              <IconUsers size={32} color="blue" />
              <div>
                <Text size="xs" color="dimmed" fw={700} tt="uppercase">Total Users</Text>
                <Text fw={700} size="xl">{stats?.total_users || 0}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder p="md" radius="md">
            <Group>
              <IconUserCheck size={32} color="orange" />
              <div>
                <Text size="xs" color="dimmed" fw={700} tt="uppercase">Pending Verification</Text>
                <Text fw={700} size="xl">{stats?.pending_workers || 0}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder p="md" radius="md">
            <Group>
              <IconClock size={32} color="green" />
              <div>
                <Text size="xs" color="dimmed" fw={700} tt="uppercase">Active Sessions</Text>
                <Text fw={700} size="xl">{stats?.active_tasks || 0}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>

      <Title order={3} mb="md">Quick Actions</Title>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fw={500}>Caregiver Management</Text>
            <Text size="sm" c="dimmed" mb="md">Review Aadhaar cards and approve new staff for SafeStay.</Text>
            <Button fullWidth onClick={() => navigate('/admin/verify')}>Open Verification List</Button>
          </Card>
        </Grid.Col>
        {/* You can add more cards here for Earnings, Reports, etc. */}
      </Grid>
    </Container>
  );
}