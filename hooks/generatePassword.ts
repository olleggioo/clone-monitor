
export const generatePassword = () => {
    const upperCaseRegex = /^[A-Z]$/;
    const lowerCaseRegex = /^[a-z]$/;
    const numberRegex = /^[0-9]$/;
    const symbolRegex = /^[-#!$@£%^&*()_+|~=`{}\[\]:";'<>?,.\/ ]$/;
    const length = 12;
  
    const getRandomCharacter = (characters: any) => {
      const index = Math.floor(Math.random() * characters.length);
      return characters[index];
    };
  
    const characters = [
      ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', upperCaseRegex],
      ['abcdefghijklmnopqrstuvwxyz', lowerCaseRegex],
      ['0123456789', numberRegex],
      ['-#!$@£%^&*()_+|~=`{}\[\]:";\'<>?,.\/ ', symbolRegex],
    ];
  
    let password = '';
  
    for (let i = 0; i < length; i++) {
      const [validCharacters, regex] = characters[Math.floor(Math.random() * characters.length)];
      let character = getRandomCharacter(validCharacters);
      if (i < characters.length) {
        // character = getRandomCharacter(validCharacters.replace(regex, ''));
      }
      password += character;
    }
  
    return password;
  };
  