import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Typography,
  TextField,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  GetApp as DownloadIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { format } from 'date-fns';
import { fetchDocuments, deleteDocument, updateDocument } from '@/services/documentService';
import { Document } from '@/types/document';
import { useAuth } from '@/hooks/useAuth';

export default function DocumentList() {
  const [search, setSearch] = useState('');
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [comments, setComments] = useState('');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery('documents', fetchDocuments);

  const deleteMutation = useMutation(deleteDocument, {
    onSuccess: () => {
      queryClient.invalidateQueries('documents');
    },
  });

  const updateMutation = useMutation(
    (doc: Document) => updateDocument(doc.id, { comments }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('documents');
        handleCloseDialog();
      },
    }
  );

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (document: Document) => {
    setEditingDocument(document);
    setComments(document.comments || '');
  };

  const handleCloseDialog = () => {
    setEditingDocument(null);
    setComments('');
  };

  const handleUpdate = () => {
    if (editingDocument) {
      updateMutation.mutate({ ...editingDocument, comments });
    }
  };

  const filteredDocuments = documents?.filter((doc) => {
    const searchLower = search.toLowerCase();
    return (
      doc.name.toLowerCase().includes(searchLower) ||
      doc.type.toLowerCase().includes(searchLower) ||
      doc.employeeName?.toLowerCase().includes(searchLower) ||
      doc.comments?.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search Documents"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Uploaded By</TableCell>
              <TableCell>Upload Date</TableCell>
              <TableCell>Comments</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDocuments?.map((document) => (
              <TableRow key={document.id}>
                <TableCell>{document.name}</TableCell>
                <TableCell>{document.type}</TableCell>
                <TableCell>{document.employeeName}</TableCell>
                <TableCell>
                  {format(new Date(document.uploadDt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>{document.comments}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Download">
                    <IconButton
                      component={Link}
                      href={document.file_path}
                      target="_blank"
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                  {(user?.roles.includes('Admin') ||
                    document.uploadedBy === Number(user?.id)) && (
                    <>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(document)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(document.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!editingDocument} onClose={handleCloseDialog}>
        <DialogTitle>Edit Document Comments</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comments"
            fullWidth
            multiline
            rows={4}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}