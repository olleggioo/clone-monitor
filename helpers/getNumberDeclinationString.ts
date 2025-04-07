const getNumberDeclinationString = (number: any, words: string[]) => {
  const num = (Math.abs(number) % 100) % 10
  if (number > 10 && number < 20) return `${number} ${words[2]}`
  if (num > 1 && num < 5) return `${number} ${words[1]}`
  if (num == 1) return `${number} ${words[0]}`
  return `${number} ${words[2]}`
}

export default getNumberDeclinationString
