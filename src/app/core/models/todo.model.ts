import { TodoStatus } from "../enums";

export interface ITodo {
  id: number;
  title: string;
  description: string;
  status: TodoStatus;
  createdBy: string;
  created: Date;
  lastModifiedBy?: string;
  lastModified?: Date;
}
