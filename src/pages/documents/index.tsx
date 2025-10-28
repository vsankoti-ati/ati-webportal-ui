import { Box, Container, Typography } from '@mui/material';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import DocumentUpload from '@/components/documents/DocumentUpload';
import DocumentList from '@/components/documents/DocumentList';

export default function DocumentsPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Documents
          </Typography>
          <DocumentUpload />
          <DocumentList />
        </Container>
      </Layout>
    </ProtectedRoute>
  );
}