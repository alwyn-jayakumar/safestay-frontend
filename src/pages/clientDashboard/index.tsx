import { Container, Title, Card, Text, Group, Badge, Timeline, ThemeIcon, Stack, Grid, Button,Paper } from '@mantine/core';
import { IconUserCheck, IconClock, IconCheck, IconActivity } from '@tabler/icons-react';
import { useFetch } from '../../hooks/useApi';  

export function ClientDashboard() {
  const { data: patient } = useFetch<any>('/client/patient-status');

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Title order={2}>Patient Care Monitor</Title>

        {/* 1. Real-time Status Card */}
        <Card withBorder radius="md" p="xl" bg="teal.0">
          <Group justify="space-between">
            <div>
              <Text size="xs" c="teal.9" fw={700} tt="uppercase">Live Monitoring</Text>
              <Text size="xl" fw={800}>Patient: Mr. Ramanathan</Text>
            </div>
            <Badge size="xl" color="teal" variant="filled">Safe & Home</Badge>
          </Group>
          <Group mt="md">
            <IconUserCheck size={18} />
            <Text size="sm">Current Caregiver: **Vijay** (Checked in at 09:00 AM)</Text>
          </Group>
        </Card>

        {/* 2. Today's Activity Log */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Paper withBorder p="md" radius="md">
              <Text fw={700} mb="lg">Today's Logs</Text>
              <Timeline active={1} bulletSize={24} lineWidth={2}>
                <Timeline.Item title="Medicine Given" bullet={<IconCheck size={12}/>}>
                  <Text size="xs" c="dimmed">09:15 AM - Morning Dosages</Text>
                </Timeline.Item>
                <Timeline.Item title="Breakfast Completed" bullet={<IconCheck size={12}/>}>
                  <Text size="xs" c="dimmed">08:45 AM - Idly & Sambar</Text>
                </Timeline.Item>
                <Timeline.Item title="Morning Walk" bullet={<IconClock size={12}/>} lineVariant="dashed">
                  <Text size="xs" c="dimmed">Scheduled for 10:30 AM</Text>
                </Timeline.Item>
              </Timeline>
            </Paper>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Card withBorder radius="md">
              <Text fw={700} mb="xs">Quick Reports</Text>
              <Button fullWidth variant="light" mb="sm">Download Daily Report</Button>
              <Button fullWidth variant="outline" color="red">Emergency Alert</Button>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}

