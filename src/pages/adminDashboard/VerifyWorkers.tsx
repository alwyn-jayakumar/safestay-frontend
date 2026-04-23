import { Table, Button, Image, Badge, Group, Title, Text } from '@mantine/core';
import { useDelete, useFetch } from '../../hooks/useApi';
import { apiClient } from '../../api/client';
import { toast } from '../../utils/toaster';
import  { modals } from '@mantine/modals';

export function VerifyWorkers() {
  // Use your custom useFetch hook to get pending workers
  const { data: workers, refetch: refresh } = useFetch<any[]>('/admin/pending-workers');
  const { execute: rejectRequest, loading: rejectLoading } = useDelete('/admin/reject-worker');
  
  const handleVerify = async (id: number) => {
    try {
      await apiClient.patch(`/admin/verify-worker/${id}`);
      // toast.success("Verified", "Caregiver is now active on the platform");
      refresh(); // Refresh the list
    } catch (err) {
      toast.error("Error", "Could not verify worker");
    }
  };

  const openRejectModal = (id: number, name: string) => 
    modals.openConfirmModal({
      title: 'Reject Application',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to reject <b>{name}'s</b> application? 
          This action will permanently delete their data from the SafeStay database.
        </Text>
      ),
      labels: { confirm: 'Reject Applicant', cancel: "No, don't delete" },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await rejectRequest(id);
          // toast.success("Rejected", "Application removed successfully");
          refresh();
        } catch (err) {
          toast.error("Error", "Failed to remove applicant");
        }
      },
    });

  const rows = workers?.map((worker) => (
    <Table.Tr key={worker.id}>
      <Table.Td>{worker.full_name}</Table.Td>
      <Table.Td>{worker.email}</Table.Td>
      <Table.Td>{worker.aadhaar_number}</Table.Td>
      <Table.Td>
        {/* We point to your backend 'uploads' folder */}
        <Image 
          src={`http://127.0.0.1:8000/${worker.id_proof_path}`} 
          h={50} w={80} fit="contain" fallbackSrc="https://placehold.co/80x50?text=No+ID"
        />
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
        <Button color="green" size="xs" onClick={() => handleVerify(worker.id)}>
          Approve
        </Button>
        <Button 
            color="red" 
            variant="light" 
            size="xs" 
            loading={rejectLoading}
            onClick={() => openRejectModal(worker.id, worker.full_name)}          >
            Reject
          </Button>
          </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div style={{ padding: '20px' }}>
      <Title order={2} mb="lg">Pending Caregiver Verifications</Title>
      <Table striped highlightOnHover border={1}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Aadhaar</Table.Th>
            <Table.Th>ID Proof</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </div>
  );
}