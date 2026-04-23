import { Container, Title, Text, Paper, Badge, Group, Stack, Button, Alert } from '@mantine/core';
import { useAuth } from '../../hooks/useAuth';
import { IconAlertCircle, IconCheck, IconCalendar } from '@tabler/icons-react';

export function WorkerDashboard() {
  const { user } = useAuth();

  console.log(user,'user');
  
  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={2}>Caregiver Portal</Title>
          <Badge size="lg" color={user?.is_verified ? "green" : "orange"}>
            {user?.is_verified ? "Verified Professional" : "Pending Verification"}
          </Badge>
        </Group>

        {/* 1. Show warning if not verified */}
        {!user?.is_verified && (
          <Alert variant="light" color="orange" title="Verification Required" icon={<IconAlertCircle />}>
            Your documents are being reviewed by the SafeStay Admin. You will be able to accept tasks once approved.
          </Alert>
        )}

        {/* 2. Profile Quick View */}
        <Paper withBorder p="md" radius="md">
          <Text size="sm" c="dimmed">Welcome back,</Text>
          <Text size="xl" fw={700}>{user?.name}</Text>
          <Text size="xs" mt={4}>Role: {user?.role} | ID: #00{user?.id}</Text>
        </Paper>

        {/* 3. Task Placeholder (We will build the Task API next) */}
        <Title order={3} mt="lg">Today's Schedule</Title>
        {user?.is_verified ? (
          <Paper withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
            <IconCalendar size={48} stroke={1.5} color="gray" />
            <Text fw={500} mt="md">No tasks assigned for today.</Text>
            <Text size="sm" c="dimmed">New patient requests will appear here.</Text>
          </Paper>
        ) : (
          <Text c="dimmed">Finish verification to view your schedule.</Text>
        )}

        <Button fullWidth variant="light" color="blue" disabled={!user?.is_verified}>
          Check-in for Duty
        </Button>
      </Stack>
    </Container>
  );
}