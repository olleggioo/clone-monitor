const regExpPatterns = {
  email: new RegExp('[^@ \\t\\r\\n]+@[^@ \\t\\r\\n]+\\.[^@ \\t\\r\\n]+'),
  letterLower: new RegExp('^(?=.*?[a-z])'),
  letterUpper: new RegExp('^(?=.*?[A-Z])'),
  oneDigit: new RegExp('^(?=.*?[0-9])'),
  oneSymbol: new RegExp('^(?=.*?[`!@#№?$%^&*()~=+<>_|/\\\\.,:;\\[\\]{}\'"`])'),
  password: new RegExp(
    `^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[\`!@#№?$%^&*()~=+<>_|/\\\\.,:;\\[\\]{}\'"\`]).{12,}`
  ),
  userNameSymbols: new RegExp(`^[a-zA-Z0-9]+$`),
  userName: new RegExp(`^[a-zA-Z0-9]{3,32}$`)
}

export default regExpPatterns
