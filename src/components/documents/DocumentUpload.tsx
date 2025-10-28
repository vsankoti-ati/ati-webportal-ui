import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { uploadDocument } from '@/services/documentService';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface DocumentUploadFormData {
  name: string;
  type: string;
  comments?: string;
}

export default function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm<DocumentUploadFormData>();

  const uploadMutation = useMutation(
    async (data: { formData: DocumentUploadFormData; file: File }) => {
      await uploadDocument(data.file, data.formData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('documents');
        reset();
        setFile(null);
      },
    }
  );

  const onSubmit = async (formData: DocumentUploadFormData) => {
    if (!file) return;
    uploadMutation.mutate({ formData, file });
  };

  const documentTypes = [
    'Resume',
    'Offer Letter',
    'ID Proof',
    'Address Proof',
    'Certificates',
    'Others',
  ];

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Upload Document
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box
          sx={{
            mb: 3,
            p: 2,
            border: '2px dashed #ccc',
            borderRadius: 1,
            textAlign: 'center',
          }}
        >
          <input
            type="file"
            id="file-upload"
            style={{ display: 'none' }}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <label htmlFor="file-upload">
            <Button
              component="span"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 1 }}
            >
              Choose File
            </Button>
          </label>
          {file && (
            <Typography variant="body2" color="textSecondary">
              Selected file: {file.name}
            </Typography>
          )}
        </Box>

        <Controller
          name="name"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Document Name"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error ? 'Document name is required' : ''}
            />
          )}
        />

        <Controller
          name="type"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth margin="normal" error={!!error}>
              <InputLabel>Document Type</InputLabel>
              <Select {...field} label="Document Type">
                {documentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name="comments"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Comments"
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={!file || uploadMutation.isLoading}
        >
          {uploadMutation.isLoading ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Uploading...
            </>
          ) : (
            'Upload Document'
          )}
        </Button>
      </Box>
    </Paper>
  );
}