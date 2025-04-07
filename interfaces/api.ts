export type HashRateType = string
export type RejectRateType = string

export interface PaginationI {
  limit: number
  offset: number
  total_count: number
}

export interface ReqQueryParamsI {
  // accessToken: string
  page?: number
  offset?: number
  skip?: number
  limit?: number
  take?: number
  select?: object
  relations?: object
  where?: any
  order?: object
  query?: string
  createdAt?: Array<string>
}

export interface GetOneReqQueryParamsI {
  select?: any
  relations?: any
}
