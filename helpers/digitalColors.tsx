const coloredDigits = (str: string) => {
  const digits = str.split('/');
  const coloredDigits = digits.map((digit, index) => {
      if(digits.length - 1 === index) {
        return <span key={index} style={{ color: getColorForIndex(index) }}>{digit}</span>
      } else {
        return <span key={index} style={{ color: getColorForIndex(index) }}>{digit} /</span>
      }
    });
    
    return <span>{coloredDigits}</span>;
};

const getColorForIndex = (index: number) => {
  const colors = ['#63B283', '#FFA800', '#DFDFDF', '#878787', '#FF5353'];
  return colors[index] || 'black';
};

export default coloredDigits