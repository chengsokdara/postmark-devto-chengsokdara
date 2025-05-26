export type ApiSuccessResponse<T> = {
  data: T;
  message: string;
};

export type ApiErrorResponse = {
  error: string;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
