
const IconLuxor = ({
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
        viewBox="0 0 80 70"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        {...props}
    >
        <title>{"Luxor"}</title>
        <defs>
        <radialGradient
            cx="64.6036328%"
            cy="0.0477138606%"
            fx="64.6036328%"
            fy="0.0477138606%"
            r="115.030049%"
            gradientTransform="translate(0.646036,0.000477),scale(1.000000,0.880576),rotate(97.347940),translate(-0.646036,-0.000477)"
            id="radialGradient-1"
        >
            <stop stopColor="#E5AA12" offset="0%" />
            <stop stopColor="#FFFFFF" stopOpacity={0} offset="100%" />
        </radialGradient>
        <radialGradient
            cx="-0.307134358%"
            cy="-2.71988401e-06%"
            fx="-0.307134358%"
            fy="-2.71988401e-06%"
            r="134.427269%"
            gradientTransform="translate(-0.003071,-0.000000),scale(1.000000,0.708246),rotate(67.893089),translate(0.003071,0.000000)"
            id="radialGradient-2"
        >
            <stop stopColor="#E5AA12" offset="0%" />
            <stop stopColor="#FFFFFF" stopOpacity={0} offset="100%" />
        </radialGradient>
        </defs>
        <g
        id="\u9875\u9762-1"
        stroke="none"
        strokeWidth={1}
        fill="none"
        fillRule="evenodd"
        >
        <g
            id="\u77FF\u6C60logo"
            transform="translate(-186.000000, -3565.000000)"
            fillRule="nonzero"
        >
            <g id="Luxor" transform="translate(186.000000, 3565.000000)">
            <path
                d="M17.2346875,34.2823923 C19.7924547,30.0367931 26.1517525,31.0590139 27.2824756,35.8974082 L33.6528135,63.1570043 C34.4691357,66.6501266 31.8495284,69.9992785 28.3010385,69.9992785 L5.50786267,69.9992785 C1.21639466,69.9992785 -1.42134072,65.2487413 0.811881529,61.5419083 L17.2346875,34.2823923 Z"
                id="\u8DEF\u5F84"
                fill="#F0BB31"
            />
            <path
                d="M17.2346875,34.2823923 C19.7924547,30.0367931 26.1517525,31.0590139 27.2824756,35.8974082 L33.6528135,63.1570043 C34.4691357,66.6501266 31.8495284,69.9992785 28.3010385,69.9992785 L5.50786267,69.9992785 C1.21639466,69.9992785 -1.42134072,65.2487413 0.811881529,61.5419083 L17.2346875,34.2823923 Z"
                id="\u8DEF\u5F84"
                fill="url(#radialGradient-1)"
            />
            <path
                d="M30.5772848,6.78620728 C29.214241,0.767490181 37.2247434,-2.63336684 40.5996329,2.53126921 L79.0886206,61.432648 C81.4946274,65.1149516 78.85574,70 74.4602077,70 L49.3106973,70 C46.72733,70 44.4880438,68.2096706 43.9168422,65.687546 L30.5772848,6.78620728 Z"
                id="\u8DEF\u5F84"
                fill="#F0BB31"
            />
            <path
                d="M30.5772848,6.78620728 C29.214241,0.767490181 37.2247434,-2.63336684 40.5996329,2.53126921 L79.0886206,61.432648 C81.4946274,65.1149516 78.85574,70 74.4602077,70 L49.3106973,70 C46.72733,70 44.4880438,68.2096706 43.9168422,65.687546 L30.5772848,6.78620728 Z"
                id="\u8DEF\u5F84"
                fill="url(#radialGradient-2)"
            />
            </g>
        </g>
        </g>
    </svg>
    )
  }
  
  export default IconLuxor
  