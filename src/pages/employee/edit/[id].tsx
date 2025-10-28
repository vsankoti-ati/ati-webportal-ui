import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Container, CircularProgress } from '@mui/material';
import Layout from '../../../components/Layout';
import EmployeeForm from '../../../components/EmployeeForm';
import { Employee, employeeService } from '../../../services/employee';
import { ProtectedRoute } from '../../../components/ProtectedRoute';

export default function EditEmployeePage() {
  const router = useRouter();
  const { id } = router.query;
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadEmployee();
    }
  }, [id]);

  const loadEmployee = async () => {
    try {
      const data = await employeeService.getById(Number(id));
      setEmployee(data);
    } catch (error) {
      console.error('Error loading employee:', error);
      router.push('/employee');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ProtectedRoute roles={['Admin', 'HR']}>
      <Layout>
        <Container maxWidth="lg">
          <Box sx={{ mt: 4 }}>
            {employee && <EmployeeForm employee={employee} isEdit />}
          </Box>
        </Container>
      </Layout>
    </ProtectedRoute>
  );
}