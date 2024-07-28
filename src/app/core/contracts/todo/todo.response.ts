import { TodoStatus } from "../../enums";
import { ITodo } from "../../models";

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
export function mapTodoResponseToITodo(response: TodoResponse): ITodo {
  return {
    id: response.id,
    title: response.title,
    description: response.description,
    status: mapStatus(response.status),
    createdBy: response.createdBy,
    created: new Date(response.created),
    lastModifiedBy: response.lastModifiedBy,
    lastModified: response.lastModified
      ? new Date(response.lastModified)
      : undefined,
  };
}

export function mapStatus(status: number): TodoStatus {
  switch (status) {
    case 1:
      return TodoStatus.Opening;
    case 2:
      return TodoStatus.Progressing;
    case 3:
      return TodoStatus.Testing;
    case 4:
      return TodoStatus.Done;
    case 5:
      return TodoStatus.Rejected;
    default:
      throw new Error(`Unknown status: ${status}`);
  }
}
