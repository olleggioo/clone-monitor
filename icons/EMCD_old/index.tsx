
const IconEMCD_OLD = ({
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
        viewBox="0 0 80 80"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        {...props}
    >
        <title>{"EMCDPool"}</title>
        <defs>
        <linearGradient
            x1="111.17025%"
            y1="140.70694%"
            x2="30.76475%"
            y2="-36.78406%"
            id="linearGradient-1"
        >
            <stop stopColor="#573FDD" offset="0%" />
            <stop stopColor="#7E46DC" offset="100%" />
        </linearGradient>
        </defs>
        <g
        id="\u9875\u9762-1"
        stroke="none"
        strokeWidth={1}
        fill="none"
        fillRule="evenodd"
        >
        <g
            id="\u753B\u677F"
            transform="translate(-186.000000, -354.000000)"
            fill="url(#linearGradient-1)"
        >
            <g id="EMCDPool" transform="translate(186.000000, 354.000000)">
            <path
                d="M0,19 C0,10.16344 7.16344,3 16,3 L80,3 C80,11.83656 72.8366,19 64,19 L0,19 Z M0,76.6 L64,76.6 C72.8366,76.6 80,69.4366 80,60.6 L16,60.6 C7.16344,60.6 0,67.7634 0,76.6 Z M0,47.8 C0,38.9634 7.11404,31.8 15.88966,31.8 L39.7242,31.8 C39.7242,40.6366 32.61,47.8 23.8344,47.8 L0,47.8 Z"
                id="\u5F62\u72B6"
            />
            </g>
        </g>
        </g>
    </svg>
    )
  }
  
  export default IconEMCD_OLD
  