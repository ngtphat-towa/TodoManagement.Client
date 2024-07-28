import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ITodo } from '../models';
import {
  CreateTodoRequest,
  UpdateTodoRequest,
  UpdateTodoStatusRequest,
} from '../contracts/todo/todo.request';
import {
  TodoResponse,
  mapTodoResponseToITodo,
} from '../contracts/todo/todo.response';
import { PagedResponse } from '../contracts/wrapper/paged-response.model';
import { ApiResponse } from '../contracts/wrapper/response.model';
import { API_BASE_URL, API_ROUTES } from '../contants';


@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private baseUrl: string = `${API_BASE_URL}${API_ROUTES.TODOS}`;

  constructor(private http: HttpClient) {}

  getAllTodos(
    page: number = 1,
    pageSize: number = 10
  ): Observable<PagedResponse<ITodo[]>> {
    return this.http
      .get<PagedResponse<TodoResponse[]>>(`${this.baseUrl}`, {
        params: {
          page: page.toString(),
          pageSize: pageSize.toString(),
        },
      })
      .pipe(
        map((response) => ({
          ...response,
          data: response.data!.map(mapTodoResponseToITodo),
        })),
        catchError(
          this.handleError<PagedResponse<ITodo[]>>(
            'getAllTodos',
            PagedResponse.failure<ITodo[]>('Failed to load todos')
          )
        )
      );
  }

  getTodoById(id: number): Observable<ApiResponse<ITodo>> {
    return this.http
      .get<ApiResponse<TodoResponse>>(`${this.baseUrl}/${id}`)
      .pipe(
        map((response) => ({
          ...response,
          data: mapTodoResponseToITodo(response.data!),
        })),
        catchError(
          this.handleError<ApiResponse<ITodo>>(
            'getTodoById',
            ApiResponse.failure<ITodo>('Todo not found')
          )
        )
      );
  }

  createTodo(request: CreateTodoRequest): Observable<ApiResponse<number>> {
    return this.http
      .post<ApiResponse<number>>(this.baseUrl, request)
      .pipe(
        catchError(
          this.handleError<ApiResponse<number>>(
            'createTodo',
            ApiResponse.failure<number>('Failed to create todo')
          )
        )
      );
  }

  updateTodo(
    id: number,
    request: UpdateTodoRequest
  ): Observable<ApiResponse<void>> {
    return this.http
      .put<ApiResponse<void>>(`${this.baseUrl}/${id}`, request)
      .pipe(
        catchError(
          this.handleError<ApiResponse<void>>(
            'updateTodo',
            ApiResponse.failure<void>('Failed to update todo')
          )
        )
      );
  }

  updateTodoStatus(
    id: number,
    request: UpdateTodoStatusRequest
  ): Observable<ApiResponse<void>> {
    return this.http
      .patch<ApiResponse<void>>(`${this.baseUrl}/${id}/status`, request)
      .pipe(
        catchError(
          this.handleError<ApiResponse<void>>(
            'updateTodoStatus',
            ApiResponse.failure<void>('Failed to update todo status')
          )
        )
      );
  }

  deleteTodo(id: number): Observable<ApiResponse<void>> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError(
          this.handleError<ApiResponse<void>>(
            'deleteTodo',
            ApiResponse.failure<void>('Failed to delete todo')
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
}
