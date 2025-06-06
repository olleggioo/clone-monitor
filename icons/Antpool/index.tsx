
const IconAntpool = ({
    width,
    height,
    ...props
  }: {
    width: number
    height: number
    [x: string]: any
  }) => {
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 40 46"
        {...props}
      >
        <path d="" stroke="none" fill="#10ac7c" fillRule="evenodd" />
        <path
          d="M 10 16.768 L 1.500 32.489 1.184 34.744 L 0.867 37 5.087 37 L 9.307 37 14.736 31.865 L 20.165 26.731 25.364 31.865 L 30.563 37 34.722 37 L 38.882 37 39.510 35.983 L 40.139 34.966 30.903 17.983 L 21.668 1 20.084 1.024 L 18.500 1.048 10 16.768 M 17.668 33.046 L 15 35.145 15 36.705 L 15 38.264 17.082 41.632 L 19.163 45 20.382 45 L 21.601 45 23.730 40.619 L 25.858 36.238 23.097 33.593 L 20.336 30.948 17.668 33.046"
          stroke="none"
          fill="#0cac7c"
          fillRule="evenodd"
        />
      </svg>
    )
  }
  
export default IconAntpool
  