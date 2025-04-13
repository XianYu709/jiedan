export interface BasicPageParams {
  page: number;
  pageSize: number;
}

export interface BasicFetchResult<T> {
  items: T[];
  total: number;
}

export interface BasicRequest {
  code: Number;
  msg: String;
  oper: String;
  succ: Boolean;
}
