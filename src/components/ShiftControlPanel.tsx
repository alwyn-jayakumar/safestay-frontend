import { useState, useEffect } from 'react';
import { Container, Title, Paper, Group, Button, Text, Stack, Card, Badge, Timeline, Divider, Textarea, Select, FileInput } from '@mantine/core';
import { useAuth } from '../hooks/useAuth';
import { Scanner } from '../features/care/Scanner';
import { IconClock, IconMapPin, IconCheck, IconPlus, IconPlayerStop, IconQrcode } from '@tabler/icons-react';
import type { Task, Shift, ActivityLog } from '../types';
import { toast } from '../utils/toaster';
import { getMockTasks, saveMockTasks } from '../data/mockData';

interface ShiftControlPanelProps {
  taskId: string;
  onComplete: () => void;
}

export function ShiftControlPanel({ taskId, onComplete }: ShiftControlPanelProps) {
  const { user } = useAuth();
  const [shift, setShift] = useState<Shift | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [activityType, setActivityType] = useState<'MEDICINE' | 'FOOD' | 'ACTIVITY'>('MEDICINE');
  const [activityDescription, setActivityDescription] = useState('');
  const [statusImage, setStatusImage] = useState<File | null>(null);
  const [statusNotes, setStatusNotes] = useState('');
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);

  useEffect(() => {
    const mockTasks = getMockTasks();
    const foundTask = mockTasks.find((item) => item.id === taskId) ?? null;
    setTask(foundTask);

    if (typeof window !== 'undefined') {
      const savedShift = window.localStorage.getItem(`safestay_shift_${taskId}`);
      if (savedShift) {
        const parsedShift = JSON.parse(savedShift) as Shift;
        setShift(parsedShift);
        setIsActive(parsedShift.status === 'ACTIVE');
        if (parsedShift.status === 'ACTIVE') {
          const start = new Date(parsedShift.start_time).getTime();
          const now = Date.now();
          setElapsedTime(Math.floor((now - start) / 1000 / 60));
        }
      }

      const savedLogs = window.localStorage.getItem(`safestay_logs_${taskId}`);
      if (savedLogs) {
        setActivityLogs(JSON.parse(savedLogs) as ActivityLog[]);
      }
    }
  }, [taskId]);

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
      const mockTask = task ?? getMockTasks().find((item) => item.id === taskId) ?? null;
      if (!mockTask) {
        toast.error("Task Not Found", "The selected task could not be loaded.");
        return;
      }

      if (data.qr !== mockTask.qr_token) {
        toast.error("Invalid QR Code", "This QR code doesn't match the assigned task.");
        return;
      }

      const workerId = String(user?.id ?? 'worker-1');
      const mockShift: Shift = {
        id: `shift-${Date.now()}`,
        task_id: taskId,
        worker_id: workerId,
        client_id: mockTask.client_id,
        start_time: new Date().toISOString(),
        status: 'ACTIVE',
        location_verified: true,
        qr_verified: true,
      };

      setShift(mockShift);
      setIsActive(true);
      setShowScanner(false);
      setElapsedTime(0);

      const updatedTasks = getMockTasks().map((item) =>
        item.id === taskId ? { ...item, status: 'IN_PROGRESS' as Task['status'], worker_id: mockShift.worker_id } : item,
      );
      saveMockTasks(updatedTasks);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(`safestay_shift_${taskId}`, JSON.stringify(mockShift));
      }

      toast.success("Shift Started", "Your caregiving session has begun. Timer is running.");
    } catch (err) {
      toast.error("Error", "Could not start shift. Please try again.");
    }
  };

  const handleEndShift = async () => {
    try {
      if (!shift) return;

      const completedShift: Shift = {
        ...shift,
        end_time: new Date().toISOString(),
        status: 'COMPLETED',
      };

      setShift(completedShift);
      setIsActive(false);
      setElapsedTime(0);

      const updatedTasks = getMockTasks().map((item) =>
        item.id === taskId ? { ...item, status: 'COMPLETED' as Task['status'] } : item,
      );
      saveMockTasks(updatedTasks);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(`safestay_shift_${taskId}`, JSON.stringify(completedShift));
      }

      toast.success("Shift Completed", "Generating summary report...");
      onComplete();
    } catch (err) {
      toast.error("Error", "Could not end shift. Please try again.");
    }
  };

  const handleLogActivity = async () => {
    try {
      if (!shift || !activityDescription.trim()) return;

      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        shift_id: shift.id,
        type: activityType,
        description: activityDescription,
        timestamp: new Date().toISOString(),
      };

      const nextLogs = [newLog, ...activityLogs];
      setActivityLogs(nextLogs);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(`safestay_logs_${taskId}`, JSON.stringify(nextLogs));
      }

      setActivityDescription('');
      toast.success("Activity Logged", "Care activity has been recorded.");
    } catch (err) {
      toast.error("Error", "Could not log activity. Please try again.");
    }
  };

  const handleStatusUpdate = async () => {
    try {
      if (!shift) return;

      if (!statusImage && !statusNotes.trim()) {
        toast.error("Missing Details", "Please attach an image or add a note before sending an update.");
        return;
      }

      setIsSubmittingStatus(true);
      const formData = new FormData();
      if (statusImage) {
        formData.append('file', statusImage);
      }
      formData.append('notes', statusNotes.trim() || 'Optional notes about status');

      const token = user?.token;
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/shifts/${shift.id}/status-update`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Could not send shift status update');
      }

      setStatusImage(null);
      setStatusNotes('');
      toast.success("Status Update Sent", "Your shift status update was uploaded successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not send status update';
      toast.error("Error", message);
    } finally {
      setIsSubmittingStatus(false);
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

            <Card withBorder p="md">
              <Stack>
                <Text fw={600}>Send Shift Status Update</Text>
                <Text size="sm" c="dimmed">
                  Attach an image and optional notes to update the current shift status.
                </Text>
                <FileInput
                  label="Upload image"
                  placeholder="Choose a file"
                  accept="image/*"
                  value={statusImage}
                  onChange={setStatusImage}
                />
                <Textarea
                  label="Notes"
                  placeholder="Optional notes about status"
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  minRows={2}
                />
                <Button
                  onClick={handleStatusUpdate}
                  loading={isSubmittingStatus}
                  disabled={!statusImage && !statusNotes.trim()}
                >
                  Send Status Update
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