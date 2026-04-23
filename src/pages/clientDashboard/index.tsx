import { Container, Title, Card, Text, Group, Badge, Timeline, Stack, Grid, Button, Paper, Center, Loader } from '@mantine/core';
import { IconCheck, IconClock, IconPlus, IconAlertCircle, IconUser } from '@tabler/icons-react';
import { useFetch } from '../../hooks/useApi'; // Using your corrected auto-fetch hook
import { useNavigate } from 'react-router-dom';

export function ClientDashboard() {
  const navigate = useNavigate();
  
  // 1. Fetch real tasks from your new FastAPI endpoint
  const { data: tasks, loading, error } = useFetch<any[]>('/client/my-tasks');

  // 2. Helper to get status colors
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED': return 'green';
      case 'ACCEPTED': return 'blue';
      default: return 'orange';
    }
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Group justify="space-between">
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
          <Grid>
            {/* 1. Main Timeline (Dynamic Logs) */}
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Paper withBorder p="md" radius="md">
                <Text fw={700} mb="lg">Activity Log</Text>
                
                {tasks && tasks.length > 0 ? (
                  <Timeline active={tasks.filter(t => t.status === 'COMPLETED').length} bulletSize={24} lineWidth={2}>
                    {tasks.map((task: any) => (
                      <Timeline.Item 
                        key={task.id}
                        title={task.title}
                        bullet={task.status === 'COMPLETED' ? <IconCheck size={12}/> : <IconClock size={12}/>}
                      >
                        <Text size="sm" mt={4}>{task.description}</Text>
                        <Group gap="xs" mt="xs">
                          <Badge size="xs" variant="light" color={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                          <Text size="xs" c="dimmed">{task.location}</Text>
                        </Group>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                ) : (
                  <Center py="xl">
                    <Stack align="center">
                      <Text c="dimmed">No care requests found for your account.</Text>
                      <Button variant="light" onClick={() => navigate('/client/create-request')}>
                        Post your first request
                      </Button>
                    </Stack>
                  </Center>
                )}
              </Paper>
            </Grid.Col>

            {/* 2. Side Panel */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack>
                {/* Active Caregiver Card (Dynamic logic could be added here later) */}
                <Card withBorder radius="md">
                  <Text fw={700} mb="xs">Active Caregiver</Text>
                  <Group>
                    <IconUser size={32} color="gray" />
                    <div>
                      <Text size="sm" fw={500}>Not Assigned Yet</Text>
                      <Text size="xs" c="dimmed">Waiting for worker to accept</Text>
                    </div>
                  </Group>
                </Card>

                {/* Emergency Controls */}
                <Card withBorder radius="md" bg="red.0">
                  <Text fw={700} c="red.9" mb="xs">Quick Actions</Text>
                  <Stack gap="xs">
                    <Button color="red" leftSection={<IconAlertCircle size={16}/>}>
                      Emergency SOS
                    </Button>
                    <Button variant="outline" color="gray" size="xs">
                      Download History
                    </Button>
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>
        )}
      </Stack>
    </Container>
  );
}