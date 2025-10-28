import { api } from '@/lib/api';
import { Document, CreateDocumentDto, UpdateDocumentDto } from '@/types/document';

export const uploadDocument = async (file: File, data: CreateDocumentDto): Promise<Document> => {
  const formData = new FormData();
  formData.append('file', file);
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value);
    }
  });

  const response = await api.post('/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const fetchDocuments = async (): Promise<Document[]> => {
  const response = await api.get('/documents');
  return response.data;
};

export const fetchDocument = async (id: number): Promise<Document> => {
  const response = await api.get(`/documents/${id}`);
  return response.data;
};

export const updateDocument = async (id: number, data: UpdateDocumentDto): Promise<Document> => {
  const response = await api.patch(`/documents/${id}`, data);
  return response.data;
};

export const deleteDocument = async (id: number): Promise<void> => {
  await api.delete(`/documents/${id}`);
};