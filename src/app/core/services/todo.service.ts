import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { API_BASE_URL, API_ROUTES } from '../contants/api.constants';
import {
  CreateTodoRequest,
  UpdateTodoRequest,
  UpdateTodoStatusRequest,
} from '../contracts/todo/todo.request';
import {
  mapTodoResponseToITodo,
  TodoResponse,
} from '../contracts/todo/todo.response';
import { PagedResponse } from '../contracts/wrapper/paged-response.model';
import { ApiResponse } from '../contracts/wrapper/response.model';
import { ITodo } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private baseUrl: string = `${API_BASE_URL}`;

  constructor(private http: HttpClient) {}

  getAllTodos(
    page: number = 1,
    pageSize: number = 10
  ): Observable<PagedResponse<ITodo[]>> {
    return this.http
      .get<PagedResponse<TodoResponse[]>>(
        `${this.baseUrl}${API_ROUTES.TODOS}`,
        {
          params: {
            page: page.toString(),
            pageSize: pageSize.toString(),
          },
        }
      )
      .pipe(
        map((response) => ({
          ...response,
          data: response.data!.map(mapTodoResponseToITodo),
        })),
        catchError(
          this.handleError<PagedResponse<ITodo[]>>(
            'getAllTodos',
            {} as PagedResponse<ITodo[]>
          )
        )
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  getTodoById(id: number): Observable<ApiResponse<ITodo>> {
    return this.http
      .get<ApiResponse<TodoResponse>>(
        `${this.baseUrl}${API_ROUTES.TODOS}/${id}`
      )
      .pipe(
        map((response) => ({
          ...response,
          data: mapTodoResponseToITodo(response.data!),
        }))
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
    updateTodoRequest: UpdateTodoRequest
  ): Observable<ITodo> {
    return this.http
      .put<ApiResponse<TodoResponse>>(
        `${this.baseUrl}${API_ROUTES.TODOS}/${id}`,
        updateTodoRequest
      )
      .pipe(
        map((response) => mapTodoResponseToITodo(response.data!)),
        catchError(this.handleError<ITodo>('updateTodo'))
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
