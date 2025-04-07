import { KeyValueObjType, ReqQueryParamsI } from '@/interfaces'

const getReqQueryString = (params?: ReqQueryParamsI) => {
  let query = ''
  const props: KeyValueObjType = {}
  if (!!params?.where && !!Object.keys(params.where).length) {
    props.where = JSON.stringify(params.where)
  }
  if (!!params?.select && !!Object.keys(params.select).length) {
    props.select = JSON.stringify(params.select)
  }
  if (!!params?.relations && !!Object.keys(params.relations).length) {
    props.relations = JSON.stringify(params.relations)
  }
  if (!!params?.order && !!Object.keys(params.order).length) {
    props.order = JSON.stringify(params.order)
  }
  if (!!params?.page) {
    props.page = params.page
  }
  if (!!params?.limit) {
    props.limit = params.limit
  }
  if (!!params?.offset) {
    props.offset = params.offset
  }
  if (!!params?.createdAt) {
    props.createdAt = JSON.stringify(params.createdAt)
  }
  if (!!Object.keys(props).length) {
    query = `?${new URLSearchParams(props).toString()}`
  }
  return query
}

export default getReqQueryString
