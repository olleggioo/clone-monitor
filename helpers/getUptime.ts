const getUptime = (seconds: number) => {
  const days = Math.floor(seconds / (3600 * 24))
  const hours = Math.floor((seconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  const daysString = days > 0 ? `${days}д` : ''
  const hoursString = hours > 0 ? `${hours}ч` : ''
  const minutesString = minutes > 0 ? `${minutes}м` : ''
  return `${daysString} ${hoursString} ${minutesString}`
}

export default getUptime
