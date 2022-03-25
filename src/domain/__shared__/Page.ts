export interface Page<T> {
  items: Array<T>;
  paging: Paging;
}

export interface Paging {
  totalCount: number;
  pageSize: number;
  pageNumber: number;
}

export interface PagingCondition {
  pageSize: number;
  pageNumber: number;
}
