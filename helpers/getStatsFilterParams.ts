import { StatsFilterStateI } from '@/atoms/statsAtom'

export const getDevicesFilterParams = (params: StatsFilterStateI) => {
  const { client, area, algorithm, model, status, ranges } = params
  const filterParams: {
    [key: string]: string
  } = {}

  if (client) {
    filterParams.userId = client
  }

  if (area) {
    filterParams.areaId = area
  }

  if (algorithm) {
    filterParams.algorithm = algorithm
  }

  if(model) {
    filterParams.model = model
  }

  if(status) {
    filterParams.status = status
  }

  if(ranges) {
    filterParams.ranges = ranges
  }

  return filterParams
}
