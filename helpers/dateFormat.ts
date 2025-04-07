export const setZeros = (time: number): string => {
  return time < 10 ? `0${time}` : `${time}`
}

export const getFullDate = (item: string) => {
  const date = new Date(item)
  return `${setZeros(date.getDate())}.${setZeros(date.getMonth() + 1)}.${date
    .getFullYear()
    .toString()
    .substring(2, 4)}`
}
export const getTime = (item: string) => {
  const date = new Date(item)
  return `${setZeros(date.getHours())}:${setZeros(date.getMinutes())}`
}

export const getTimeWithDate = (item?: string) => {
  const date = item ? new Date(item) : new Date()
  return `${setZeros(date.getHours())}:${setZeros(
    date.getMinutes()
  )}, ${setZeros(date.getDate())}.${setZeros(date.getMonth() + 1)}`
}
