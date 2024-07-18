export interface TodoResponse {
  id: number;
  title: string;
  description: string;
  status: number;
  createdBy: string;
  created: Date;
  lastModifiedBy: string;
  lastModified: Date | null;
}
