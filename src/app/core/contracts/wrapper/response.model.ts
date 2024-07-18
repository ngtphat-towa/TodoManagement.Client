export interface IApiResponse<T> {
  succeeded: boolean;
  message: string;
  errors?: string[];
  data?: T;
}

export class ApiResponse<T> implements IApiResponse<T> {
  succeeded: boolean;
  message: string;
  errors?: string[];
  data?: T;

  constructor(
    data?: T,
    message: string = 'Success',
    succeeded: boolean = true,
    errors?: string[]
  ) {
    this.succeeded = succeeded;
    this.message = message;
    this.errors = errors;
    this.data = data;
  }

  static success<T>(data: T, message: string = 'Success'): ApiResponse<T> {
    return new ApiResponse(data, message, true);
  }

  static failure<T>(message: string, errors?: string[]): ApiResponse<T> {
    return new ApiResponse(undefined as unknown as T, message, false, errors);
  }

  static message<T>(message: string, succeeded: boolean = false): ApiResponse<T> {
    return new ApiResponse(undefined as unknown as T, message, succeeded);
  }
}
