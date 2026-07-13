// src/types/document.ts

export interface DocumentItem {
  id: string;
  subject_id: string;
  title: string;
  file_path: string;
  status: string;
  uploaded_at: string;
}

export interface DocumentSummary {
  content: string;
  summary_type: string;
  topic_name: string;
}

export interface DownloadUrlResponse {
  url: string;
}   