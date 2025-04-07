const roundingNumbers = (n: string, roundValue: number) => {
  const splitN = n.split('.')

  let fixedN
  if (splitN && splitN.length > 1 && splitN[1].length > roundValue) {
    fixedN = Number(n).toFixed(roundValue)
    if (fixedN.split('.')[1] === '0') {
      fixedN = fixedN.split('.')[0]
    }
  }

  return fixedN ?? n
}

export default roundingNumbers
