import { ApiResponse, IApiResponse } from './response.model';

export interface IPagedResponse<T> extends IApiResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

export class PagedResponse<T> extends ApiResponse<T> implements IPagedResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;

  constructor(
    data: T,
    pageNumber: number,
    pageSize: number,
    totalPages: number,
    totalRecords: number,
    message: string = 'Success',
    succeeded: boolean = true,
    errors?: string[]
  ) {
    super(data, message, succeeded, errors);
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.totalPages = totalPages;
    this.totalRecords = totalRecords;
  }

  static createPagedResponse<T>(
    data: T,
    pageNumber: number,
    pageSize: number,
    totalPages: number,
    totalRecords: number,
    message: string = 'Success',
    succeeded: boolean = true,
    errors?: string[]
  ): PagedResponse<T> {
    return new PagedResponse(
      data,
      pageNumber,
      pageSize,
      totalPages,
      totalRecords,
      message,
      succeeded,
      errors
    );
  }

  static override failure<T>(
    message: string,
    errors?: string[]
  ): PagedResponse<T> {
    return new PagedResponse(
      undefined as unknown as T,
      0,
      0,
      0,
      0,
      message,
      false,
      errors
    );
  }

  static override message<T>(
    message: string,
    succeeded: boolean = false
  ): PagedResponse<T> {
    return new PagedResponse(
      undefined as unknown as T,
      0,
      0,
      0,
      0,
      message,
      succeeded
    );
  }
}
