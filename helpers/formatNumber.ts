const formatNumber = (num: number) => {
  return new Intl.NumberFormat('ru').format(num)
}

export default formatNumber
