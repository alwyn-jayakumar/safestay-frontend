import { Container, Title, Text, Paper, Badge, Group, Stack, Button, Alert, Card, SimpleGrid, Tabs } from '@mantine/core';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useApi';
import { IconAlertCircle, IconCalendar, IconMapPin, IconClock, IconPlayerPlay } from '@tabler/icons-react';
import { apiClient } from '../../api/client';
import { toast } from '../../utils/toaster';
import { useNavigate } from 'react-router-dom';
import type { Task } from '../../types';

export function WorkerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch available tasks for acceptance
  const { data: availableTasks, refetch: refetchAvailable } = useFetch<Task[]>('/tasks/available');

  // Fetch assigned tasks
  const { data: assignedTasks, refetch: refetchAssigned } = useFetch<Task[]>('/worker/my-tasks');

  // Fetch active shift if any
  const { data: activeShift } = useFetch<any>('/worker/active-shift');

  const handleAcceptTask = async (taskId: string) => {
    try {
      await apiClient.put(`/worker/accept-task/${taskId}`);
      toast.success("Task Accepted", "You have been assigned to this care request.");
      refetchAvailable();
      refetchAssigned();
    } catch (err) {
      toast.error("Error", "Could not accept task");
    }
  };

  const handleStartShift = (taskId: string) => {
    navigate(`/worker/shift/${taskId}`);
  };


  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={2}>Caregiver Portal</Title>
          <Badge size="lg" color={user?.is_verified ? "green" : "orange"}>
            {user?.is_verified ? "Verified Professional" : "Pending Verification"}
          </Badge>
        </Group>

        {/* Verification warning */}
        {!user?.is_verified && (
          <Alert variant="light" color="orange" title="Verification Required" icon={<IconAlertCircle />}>
            Your documents are being reviewed by the SafeStay Admin. You will be able to accept tasks once approved.
          </Alert>
        )}

        {/* Profile Quick View */}
        <Paper withBorder p="md" radius="md">
          <Text size="sm" c="dimmed">Welcome back,</Text>
          <Text size="xl" fw={700}>{user?.name}</Text>
          <Text size="xs" mt={4}>Role: {user?.role} | ID: #00{user?.id}</Text>
        </Paper>

        {/* Active Shift Indicator */}
        {activeShift && (
          <Alert color="blue" title="Active Shift" icon={<IconClock />}>
            You have an active caregiving session. Visit the shift control panel to manage it.
            <Button
              variant="light"
              size="xs"
              ml="md"
              onClick={() => navigate(`/worker/shift/${activeShift.task_id}`)}
            >
              Go to Shift Panel
            </Button>
          </Alert>
        )}

        <Tabs defaultValue="available">
          <Tabs.List>
            <Tabs.Tab value="available">Available Jobs</Tabs.Tab>
            <Tabs.Tab value="assigned">My Assignments</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="available" pt="md">
            <Title order={3} mb="md">Available Care Requests in Chennai</Title>
            {!user?.is_verified ? (
              <Text c="dimmed">Finish verification to view available jobs.</Text>
            ) : availableTasks && availableTasks.length > 0 ? (
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

                      <Text size="xs" c="dimmed" mt="xs">
                        Type: {task.type} | Posted: {new Date(task.created_at).toLocaleDateString()}
                      </Text>

                      {task.medical_instructions && task.medical_instructions.length > 0 && (
                        <Paper bg="blue.0" p="xs" radius="sm" mt="xs">
                          <Text size="xs" fw={500}>Medical Instructions:</Text>
                          {task.medical_instructions.slice(0, 2).map((inst, idx) => (
                            <Text key={idx} size="xs" c="blue.9">
                              â€¢ {inst.type}: {inst.description}
                            </Text>
                          ))}
                          {task.medical_instructions.length > 2 && (
                            <Text size="xs" c="blue.9">...and {task.medical_instructions.length - 2} more</Text>
                          )}
                        </Paper>
                      )}

                      <Button
                        fullWidth
                        mt="md"
                        color="blue"
                        onClick={() => handleAcceptTask(task.id)}
                      >
                        Accept Job
                      </Button>
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>
            ) : (
              <Paper withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
                <IconCalendar size={48} stroke={1.5} color="gray" />
                <Text fw={500} mt="md">No new requests nearby.</Text>
                <Text size="sm" c="dimmed">Check back later for new patient postings.</Text>
              </Paper>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="assigned" pt="md">
            <Title order={3} mb="md">My Assigned Tasks</Title>
            {assignedTasks && assignedTasks.length > 0 ? (
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                {assignedTasks.map((task) => (
                  <Card key={task.id} withBorder shadow="sm" radius="md" p="lg">
                    <Stack gap="xs">
                      <Badge color={task.status === 'ASSIGNED' ? 'cyan' : 'green'} variant="light">
                        {task.status}
                      </Badge>
                      <Text fw={700} size="lg">{task.title}</Text>
                      <Text size="sm" c="dimmed" lineClamp={2}>{task.description}</Text>

                      <Group gap="xs" mt="md">
                        <IconMapPin size={16} color="gray" />
                        <Text size="xs" c="dimmed">{task.location}</Text>
                      </Group>

                      <Text size="xs" c="dimmed" mt="xs">
                        Assigned: {new Date(task.assigned_at || '').toLocaleDateString()}
                      </Text>

                      {task.medical_instructions && task.medical_instructions.length > 0 && (
                        <Paper bg="teal.0" p="xs" radius="sm" mt="xs">
                          <Text size="xs" fw={500}>Care Instructions:</Text>
                          {task.medical_instructions.map((inst, idx) => (
                            <Text key={idx} size="xs" c="teal.9">
                              â€¢ {inst.type}: {inst.description}
                              {inst.time_slot && ` at ${inst.time_slot}`}
                            </Text>
                          ))}
                        </Paper>
                      )}

                      {task.status === 'ASSIGNED' && (
                        <Button
                          fullWidth
                          mt="md"
                          color="green"
                          leftSection={<IconPlayerPlay size={16} />}
                          onClick={() => handleStartShift(task.id)}
                        >
                          Start Care Session
                        </Button>
                      )}

                      {task.status === 'IN_PROGRESS' && (
                        <Button
                          fullWidth
                          mt="md"
                          color="blue"
                          leftSection={<IconPlayerPlay size={16} />}
                          onClick={() => handleStartShift(task.id)}
                        >
                          Continue Shift
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
                <Text size="sm" c="dimmed">Accept available jobs to get started.</Text>
              </Paper>
            )}
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
