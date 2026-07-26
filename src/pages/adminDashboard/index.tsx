import { Container, Grid, Paper, Text, Group, Button, Title, Card, Table } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconUsers, IconUserCheck, IconClock, IconCurrencyRupee } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { getMockAdminStats, getMockTasks } from '../../data/mockData';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(getMockAdminStats());
  const [tasks] = useState(getMockTasks());

  useEffect(() => {
    setStats(getMockAdminStats());
  }, []);

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="xl">
        <Title order={1}>Admin Command Center</Title>
        <Button color="blue" onClick={() => navigate('/admin/verify')}>Verify New Workers</Button>
      </Group>

      <Grid mb="xl">
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Paper withBorder p="md" radius="md">
            <Group>
              <IconUsers size={32} color="blue" />
              <div>
                <Text size="xs" color="dimmed" fw={700} tt="uppercase">Total Users</Text>
                <Text fw={700} size="xl">{stats.total_users}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Paper withBorder p="md" radius="md">
            <Group>
              <IconUserCheck size={32} color="orange" />
              <div>
                <Text size="xs" color="dimmed" fw={700} tt="uppercase">Pending Verification</Text>
                <Text fw={700} size="xl">{stats.pending_workers}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Paper withBorder p="md" radius="md">
            <Group>
              <IconClock size={32} color="green" />
              <div>
                <Text size="xs" color="dimmed" fw={700} tt="uppercase">Active Sessions</Text>
                <Text fw={700} size="xl">{stats.active_tasks}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Paper withBorder p="md" radius="md">
            <Group>
              <IconCurrencyRupee size={32} color="teal" />
              <div>
                <Text size="xs" color="dimmed" fw={700} tt="uppercase">Monthly Earnings</Text>
                <Text fw={700} size="xl">₹{stats.monthly_earnings}</Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fw={500}>Caregiver Verification</Text>
            <Text size="sm" c="dimmed" mb="md">Review Aadhaar, address, and caregiver documents before approving access.</Text>
            <Button fullWidth onClick={() => navigate('/admin/verify')}>Open Verification List</Button>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fw={500}>Client & Patient Registry</Text>
            <Text size="sm" c="dimmed" mb="md">Track family details, patient care needs, and service fees in one place.</Text>
            <Button fullWidth variant="light" onClick={() => navigate('/admin/verify')}>Review Registry</Button>
          </Card>
        </Grid.Col>
      </Grid>

      <Card withBorder mt="lg" p="md">
        <Title order={4} mb="md">Client and Patient Overview</Title>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Client</Table.Th>
              <Table.Th>Patient</Table.Th>
              <Table.Th>Service</Table.Th>
              <Table.Th>Fee</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {tasks.map((task) => (
              <Table.Tr key={task.id}>
                <Table.Td>{task.client_name}</Table.Td>
                <Table.Td>{task.patient_name}</Table.Td>
                <Table.Td>{task.title}</Table.Td>
                <Table.Td>₹{task.fee}</Table.Td>
                <Table.Td>{task.status}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </Container>
  );
}