import { Container, Grid, Paper, Text, Group, Badge, Table, Title, Button, Stack, ThemeIcon } from '@mantine/core';
import { IconUsers, IconCash, IconUserCheck, IconAlertCircle } from '@tabler/icons-react';
import { useFetch, usePut } from '../../hooks/useApi';

export function AdminDashboard() {
  const { data: stats } = useFetch<any>('/admin/stats');
  const { data: workers, refetch } = useFetch<any[]>('/admin/pending-workers');
  const { execute: verifyWorker } = usePut<any>('/admin/verify-worker');

  const handleVerify = async (id: number) => {
    await verifyWorker({ id, status: 'VERIFIED' });
    refetch(); // Refresh the table
  };

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="xl">Enterprise Management</Title>

      {/* 1. Statistics Cards */}
      <Grid mb="xl">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <Text size="xs" c="dimmed" fw={700}>TOTAL REVENUE</Text>
              <ThemeIcon color="green" variant="light"><IconCash size={16} /></ThemeIcon>
            </Group>
            <Text size="xl" fw={700} mt="sm">₹ 1,42,500</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <Text size="xs" c="dimmed" fw={700}>ACTIVE WORKERS</Text>
              <ThemeIcon color="blue" variant="light"><IconUsers size={16} /></ThemeIcon>
            </Group>
            <Text size="xl" fw={700} mt="sm">24</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <Text size="xs" c="dimmed" fw={700}>PENDING VERIFICATION</Text>
              <ThemeIcon color="orange" variant="light"><IconAlertCircle size={16} /></ThemeIcon>
            </Group>
            <Text size="xl" fw={700} mt="sm">08</Text>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* 2. Worker Verification Table */}
      <Paper withBorder radius="md" p="md">
        <Text fw={700} mb="md">New Worker Applications</Text>
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Location</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {workers?.map((worker) => (
              <Table.Tr key={worker.id}>
                <Table.Td fw={500}>{worker.name}</Table.Td>
                <Table.Td>{worker.email}</Table.Td>
                <Table.Td>{worker.location}</Table.Td>
                <Table.Td><Badge color="orange">Pending</Badge></Table.Td>
                <Table.Td>
                  <Button size="xs" color="blue" variant="light" onClick={() => handleVerify(worker.id)}>
                    Verify Now
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Container>
  );
}