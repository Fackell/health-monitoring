export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  status: 'success';
  pagination: Pagination;
  results: number;
  data: T[];
}
