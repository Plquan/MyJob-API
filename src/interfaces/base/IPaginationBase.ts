export interface IPaginationResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
}
