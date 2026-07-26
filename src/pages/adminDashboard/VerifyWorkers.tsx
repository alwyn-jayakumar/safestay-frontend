import { Table, Button, Group, Title, Text, Paper, Badge } from '@mantine/core';
import { useEffect, useState } from 'react';
import { getMockWorkers, saveMockWorkers } from '../../data/mockData';

export function VerifyWorkers() {
  const [workers, setWorkers] = useState(getMockWorkers());

  useEffect(() => {
    setWorkers(getMockWorkers());
  }, []);

  const handleVerify = (id: string) => {
    const next = workers.map((worker) => worker.id === id ? { ...worker, is_verified: true } : worker);
    setWorkers(next);
    saveMockWorkers(next);
  };

  const handleReject = (id: string) => {
    const next = workers.filter((worker) => worker.id !== id);
    setWorkers(next);
    saveMockWorkers(next);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title order={2} mb="lg">Pending Caregiver Verifications</Title>
      <Paper withBorder p="md">
        <Table striped highlightOnHover border={1}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Aadhaar</Table.Th>
              <Table.Th>Required Documents</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {workers.map((worker) => (
              <Table.Tr key={worker.id}>
                <Table.Td>{worker.full_name}</Table.Td>
                <Table.Td>{worker.email}</Table.Td>
                <Table.Td>{worker.aadhaar_number}</Table.Td>
                <Table.Td>
                  <Text size="sm">Aadhaar • Address proof • Caregiver certificate</Text>
                </Table.Td>
                <Table.Td>
                  <Badge color={worker.is_verified ? 'green' : 'orange'}>{worker.is_verified ? 'Approved' : 'Pending'}</Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Button color="green" size="xs" onClick={() => handleVerify(worker.id)} disabled={worker.is_verified}>Approve</Button>
                    <Button color="red" variant="light" size="xs" onClick={() => handleReject(worker.id)}>Reject</Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </div>
  );
}