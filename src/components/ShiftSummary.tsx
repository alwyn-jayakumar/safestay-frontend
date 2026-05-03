import { Container, Title, Paper, Group, Text, Stack, Card, Badge, Button, Timeline, Divider } from '@mantine/core';
import { IconDownload, IconClock, IconCheck, IconUser } from '@tabler/icons-react';
import { useFetch } from '../hooks/useApi';
import type{ ShiftSummary as ShiftSummaryType } from '../types';


interface ShiftSummaryProps {
  shiftId: string;
}

export function ShiftSummary({ shiftId }: ShiftSummaryProps) {
  const { data: summary, loading } = useFetch<ShiftSummaryType>(`/shifts/${shiftId}/summary`);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'MEDICINE': return '💊';
      case 'FOOD': return '🍽️';
      case 'ACTIVITY': return '🏃';
      default: return '📝';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleDownloadReport = () => {
    if (summary?.report_url) {
      window.open(summary.report_url, '_blank');
    }
  };

  if (loading) {
    return <Container size="md" py="xl"><Text>Loading summary...</Text></Container>;
  }

  if (!summary) {
    return <Container size="md" py="xl"><Text>Summary not available</Text></Container>;
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={2}>Shift Summary Report</Title>
          <Button
            leftSection={<IconDownload size={16} />}
            onClick={handleDownloadReport}
            disabled={!summary.report_url}
          >
            Download PDF Report
          </Button>
        </Group>

        {/* Shift Overview */}
        <Paper withBorder p="md" radius="md">
          <Title order={4} mb="md">Session Overview</Title>
          <Group grow>
            <Card withBorder>
              <Group>
                <IconClock size={24} color="blue" />
                <div>
                  <Text size="sm" c="dimmed">Total Duration</Text>
                  <Text fw={700}>{formatDuration(summary.total_duration)}</Text>
                </div>
              </Group>
            </Card>
            <Card withBorder>
              <Group>
                <IconCheck size={24} color="green" />
                <div>
                  <Text size="sm" c="dimmed">Activities Completed</Text>
                  <Text fw={700}>{summary.activities_completed}</Text>
                </div>
              </Group>
            </Card>
            <Card withBorder>
              <Group>
                <IconUser size={24} color="teal" />
                <div>
                  <Text size="sm" c="dimmed">Status</Text>
                  <Badge color="green">Completed</Badge>
                </div>
              </Group>
            </Card>
          </Group>
        </Paper>

        {/* Activity Timeline */}
        <Paper withBorder p="md" radius="md">
          <Title order={4} mb="md">Care Activities Timeline</Title>
          <Timeline active={summary.logs.length} bulletSize={24} lineWidth={2}>
            {summary.logs.map((log) => (
              <Timeline.Item
                key={log.id}
                title={`${getActivityIcon(log.type)} ${log.type}`}
                bullet={<IconCheck size={12} />}
              >
                <Text size="sm" mt={4}>{log.description}</Text>
                <Text size="xs" c="dimmed">
                  {new Date(log.timestamp).toLocaleString()}
                </Text>
                {log.notes && (
                  <Text size="xs" c="blue" mt={2}>
                    Notes: {log.notes}
                  </Text>
                )}
              </Timeline.Item>
            ))}
          </Timeline>
        </Paper>

        {/* Billing Information */}
        <Paper withBorder p="md" radius="md">
          <Title order={4} mb="md">Billing & Payment</Title>
          <Stack>
            <Group justify="space-between">
              <Text>Service Duration:</Text>
              <Text fw={500}>{formatDuration(summary.total_duration)}</Text>
            </Group>
            <Group justify="space-between">
              <Text>Rate per Hour:</Text>
              <Text fw={500}>₹250</Text>
            </Group>
            <Divider />
            <Group justify="space-between">
              <Text fw={700}>Total Amount:</Text>
              <Text fw={700} c="green">
                ₹{Math.round((summary.total_duration / 60) * 250)}
              </Text>
            </Group>
            <Badge color="green" size="sm" mt="sm">
              Payment processed automatically
            </Badge>
          </Stack>
        </Paper>

        {/* Client Feedback Section */}
        <Paper withBorder p="md" radius="md">
          <Title order={4} mb="md">Client Feedback</Title>
          <Text c="dimmed">
            Client feedback will be available here once submitted. This helps improve future care services.
          </Text>
        </Paper>
      </Stack>
    </Container>
  );
}