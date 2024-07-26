export interface CreateTodoRequest {
  title: string;
  description: string;
  status: number;
}

export interface GetTodoByTitleRequest {
  title: string;
}

export interface UpdateTodoRequest {
  title: string;
  description: string;
  status: number;
}

export interface UpdateTodoStatusRequest {
  status: number;
}
