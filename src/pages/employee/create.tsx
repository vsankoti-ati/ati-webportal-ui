import { Box, Container } from '@mui/material';
import Layout from '../../components/Layout';
import EmployeeForm from '../../components/EmployeeForm';
import { ProtectedRoute } from '../../components/ProtectedRoute';

export default function CreateEmployeePage() {
  return (
    <ProtectedRoute roles={['Admin', 'HR']}>
      <Layout>
        <Container maxWidth="lg">
          <Box sx={{ mt: 4 }}>
            <EmployeeForm />
          </Box>
        </Container>
      </Layout>
    </ProtectedRoute>
  );
}