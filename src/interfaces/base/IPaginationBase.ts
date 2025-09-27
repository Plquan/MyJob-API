export interface IPaginationResponse {
  items: any[];
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}