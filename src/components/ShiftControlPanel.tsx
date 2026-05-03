import { useState, useEffect } from 'react';
import { Container, Title, Paper, Group, Button, Text, Stack, Card, Badge, Timeline, Divider, Textarea, Select } from '@mantine/core';
import { useAuth } from '../hooks/useAuth';
import { useFetch, usePost } from '../hooks/useApi';
import { Scanner } from '../features/care/Scanner';
import { IconClock, IconMapPin, IconCheck, IconPlus, IconPlayerStop, IconQrcode } from '@tabler/icons-react';
import type { Task, Shift, ActivityLog } from '../types';
import { toast } from '../utils/toaster';

interface ShiftControlPanelProps {
  taskId: string;
  onComplete: () => void;
}

export function ShiftControlPanel({ taskId, onComplete }: ShiftControlPanelProps) {
  const { user } = useAuth();
  const [shift, setShift] = useState<Shift | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [activityType, setActivityType] = useState<'MEDICINE' | 'FOOD' | 'ACTIVITY'>('MEDICINE');
  const [activityDescription, setActivityDescription] = useState('');

  // Fetch task details
  const { data: task } = useFetch<Task>(`/tasks/${taskId}`);

  // Fetch current shift if exists
  const { data: currentShift, refetch: refetchShift } = useFetch<Shift>(`/shifts/active/${taskId}`);

  // Fetch activity logs
  const { data: activityLogs, refetch: refetchLogs } = useFetch<ActivityLog[]>(`/shifts/${currentShift?.id}/logs`);

  // API calls
  const { execute: startShift } = usePost('/shifts/start');
  const { execute: endShift } = usePost('/shifts/end');
  const { execute: logActivity } = usePost('/activities/log');

  useEffect(() => {
    if (currentShift) {
      setShift(currentShift);
      setIsActive(currentShift.status === 'ACTIVE');
      // Calculate elapsed time if active
      if (currentShift.status === 'ACTIVE') {
        const start = new Date(currentShift.start_time).getTime();
        const now = Date.now();
        setElapsedTime(Math.floor((now - start) / 1000 / 60)); // minutes
      }
    }
  }, [currentShift]);

  useEffect(() => {
    let interval: number;
    if (isActive && shift) {
      interval = setInterval(() => {
        const start = new Date(shift.start_time).getTime();
        const now = Date.now();
        setElapsedTime(Math.floor((now - start) / 1000 / 60));
      }, 60000); // Update every minute
    }
    return () => clearInterval(interval);
  }, [isActive, shift]);

  const handleScanVerified = async (data: { qr: string; coords: { lat: number; lng: number } }) => {
    try {
      if (!task) return;

      // Verify QR matches task
      if (data.qr !== task.qr_token) {
        toast.error("Invalid QR Code", "This QR code doesn't match the assigned task.");
        return;
      }

      // Start the shift
      const shiftData = await startShift({
        task_id: taskId,
        worker_id: user?.id,
        client_id: task.client_id,
        qr_verified: true,
        location_verified: true,
        start_coords: data.coords,
      });

      setShift(shiftData);
      setIsActive(true);
      setShowScanner(false);
      toast.success("Shift Started", "Your caregiving session has begun. Timer is running.");
      refetchShift();
    } catch (err) {
      toast.error("Error", "Could not start shift. Please try again.");
    }
  };

  const handleEndShift = async () => {
    try {
      if (!shift) return;

      await endShift({ shift_id: shift.id });
      setIsActive(false);
      toast.success("Shift Completed", "Generating summary report...");
      onComplete();
    } catch (err) {
      toast.error("Error", "Could not end shift. Please try again.");
    }
  };

  const handleLogActivity = async () => {
    try {
      if (!shift || !activityDescription.trim()) return;

      await logActivity({
        shift_id: shift.id,
        type: activityType,
        description: activityDescription,
        timestamp: new Date().toISOString(),
      });

      setActivityDescription('');
      refetchLogs();
      toast.success("Activity Logged", "Care activity has been recorded.");
    } catch (err) {
      toast.error("Error", "Could not log activity. Please try again.");
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (showScanner) {
    return (
      <Scanner onVerified={handleScanVerified} />
    );
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={2}>Shift Control Panel</Title>
          <Badge size="lg" color={isActive ? "green" : "orange"}>
            {isActive ? "Active Shift" : "Shift Not Started"}
          </Badge>
        </Group>

        {task && (
          <Paper withBorder p="md" radius="md">
            <Text fw={700} size="lg">{task.title}</Text>
            <Text size="sm" c="dimmed">{task.description}</Text>
            <Group mt="xs">
              <IconMapPin size={16} />
              <Text size="sm">{task.location}</Text>
            </Group>
          </Paper>
        )}

        {/* Timer Display */}
        <Card withBorder>
          <Group justify="center">
            <IconClock size={32} color={isActive ? "green" : "gray"} />
            <div style={{ textAlign: 'center' }}>
              <Text size="xl" fw={700}>{formatTime(elapsedTime)}</Text>
              <Text size="sm" c="dimmed">Elapsed Time</Text>
            </div>
          </Group>
        </Card>

        {/* Start/End Shift Controls */}
        {!isActive ? (
          <Button
            fullWidth
            size="lg"
            leftSection={<IconQrcode size={20} />}
            onClick={() => setShowScanner(true)}
            color="blue"
          >
            Start Shift - Scan QR Code
          </Button>
        ) : (
          <Button
            fullWidth
            size="lg"
            leftSection={<IconPlayerStop size={20} />}
            onClick={handleEndShift}
            color="red"
          >
            End Shift & Generate Report
          </Button>
        )}

        {/* Activity Logging */}
        {isActive && (
          <>
            <Divider />
            <Title order={4}>Log Care Activities</Title>

            <Card withBorder p="md">
              <Stack>
                <Select
                  label="Activity Type"
                  data={[
                    { value: 'MEDICINE', label: 'Medicine Administration' },
                    { value: 'FOOD', label: 'Meal Assistance' },
                    { value: 'ACTIVITY', label: 'Care Activity' },
                  ]}
                  value={activityType}
                  onChange={(value) => setActivityType(value as any)}
                />

                <Textarea
                  label="Activity Description"
                  placeholder="Describe what was done (e.g., 'Administered 1 tablet of aspirin at 2:00 PM')"
                  value={activityDescription}
                  onChange={(e) => setActivityDescription(e.target.value)}
                  minRows={3}
                />

                <Button
                  leftSection={<IconPlus size={16} />}
                  onClick={handleLogActivity}
                  disabled={!activityDescription.trim()}
                >
                  Log Activity
                </Button>
              </Stack>
            </Card>

            {/* Activity Timeline */}
            {activityLogs && activityLogs.length > 0 && (
              <Card withBorder>
                <Title order={5} mb="md">Activity Timeline</Title>
                <Timeline bulletSize={24} lineWidth={2}>
                  {activityLogs.map((log) => (
                    <Timeline.Item
                      key={log.id}
                      bullet={<IconCheck size={12} />}
                      title={log.type}
                    >
                      <Text size="sm" mt={4}>{log.description}</Text>
                      <Text size="xs" c="dimmed">
                        {new Date(log.timestamp).toLocaleString()}
                      </Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            )}
          </>
        )}
      </Stack>
    </Container>
  );
}