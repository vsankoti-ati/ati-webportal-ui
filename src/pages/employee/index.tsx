import { Box, Container } from '@mui/material';
import Layout from '../../components/Layout';
import EmployeeList from '../../components/EmployeeList';
import { ProtectedRoute } from '../../components/ProtectedRoute';

export default function EmployeePage() {
  return (
    <ProtectedRoute roles={['Admin', 'HR']}>
      <Layout>
        <Container maxWidth="lg">
          <Box sx={{ mt: 4 }}>
            <EmployeeList />
          </Box>
        </Container>
      </Layout>
    </ProtectedRoute>
  );
}