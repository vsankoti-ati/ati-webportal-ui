export interface Document {
  id: number;
  name: string;
  type: string;
  uploadedBy: number;
  uploadDt: Date;
  status: string;
  comments?: string;
  file_path: string;
  employeeName?: string;
}

export interface CreateDocumentDto {
  name: string;
  type: string;
  comments?: string;
}

export interface UpdateDocumentDto {
  name?: string;
  status?: string;
  comments?: string;
}