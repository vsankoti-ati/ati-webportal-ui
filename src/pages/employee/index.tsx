import { Box, Container } from '@mui/material';
import Layout from '../../components/Layout';
import EmployeeList from '../../components/EmployeeList';
import { ProtectedRoute } from '../../components/ProtectedRoute';

export default function EmployeePage() {
  return (
    <ProtectedRoute roles={['ati_portal_admin']}>
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