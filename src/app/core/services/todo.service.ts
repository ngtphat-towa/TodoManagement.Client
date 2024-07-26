import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL, API_ROUTES } from '../contants/api.constants';
import {
  CreateTodoRequest,
  UpdateTodoRequest,
  UpdateTodoStatusRequest,
} from '../contracts/todo/todo.request';
import { TodoResponse } from '../contracts/todo/todo.response';
import { PagedResponse } from '../contracts/wrapper/paged-response.model';
import { ApiResponse } from '../contracts/wrapper/response.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private baseUrl: string = `${API_BASE_URL}`;

  constructor(private http: HttpClient) {}

  getAllTodos(
    page: number = 1,
    pageSize: number = 10
  ): Observable<PagedResponse<TodoResponse[]>> {
    return this.http.get<PagedResponse<TodoResponse[]>>(
      `${this.baseUrl}${API_ROUTES.TODOS}`,
      {
        params: {
          page: page.toString(),
          pageSize: pageSize.toString(),
        },
      }
    );
  }

  getTodoById(id: number): Observable<ApiResponse<TodoResponse>> {
    return this.http.get<ApiResponse<TodoResponse>>(
      `${this.baseUrl}${API_ROUTES.TODOS}/${id}`
    );
  }

  createTodo(request: CreateTodoRequest): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(
      `${this.baseUrl}${API_ROUTES.TODOS}`,
      request
    );
  }

  updateTodo(
    id: number,
    request: UpdateTodoRequest
  ): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(
      `${this.baseUrl}${API_ROUTES.TODOS}/${id}`,
      request
    );
  }

  updateTodoStatus(
    id: number,
    request: UpdateTodoStatusRequest
  ): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(
      `${this.baseUrl}${API_ROUTES.TODOS}/${id}/status`,
      request
    );
  }

  deleteTodo(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.baseUrl}${API_ROUTES.TODOS}/${id}`
    );
  }
}
