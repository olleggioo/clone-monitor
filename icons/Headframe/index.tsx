
const IconHeadframe = ({
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
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 124 124"
        fill="none"
        {...props}
    >
        <rect width={124} height={124} rx={24} fill="#435FFF" />
        <text
        x={0}
        y={110}
        fill="white"
        fontSize={120}
        fontFamily="Arial"
        fontWeight="bold"
        >
        {"h"}
        </text>
        <text
        x={70}
        y={110}
        fill="white"
        fontSize={120}
        fontFamily="Arial"
        fontWeight="bold"
        >
        {"f"}
        </text>
    </svg>
    )
  }
  
  export default IconHeadframe
  