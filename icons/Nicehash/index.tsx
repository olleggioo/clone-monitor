
const IconNicehash = ({
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
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 80 78.9"
        // style={{
        // enableBackground: "new 0 0 80 78.9",
        // }}
        xmlSpace="preserve"
        {...props}
    >
        <style type="text/css">{"\n\t.st0{fill:#FBC241;}\n"}</style>
        <g>
        <path className="st0" d="M40.1,0H80v26.3H40.1V0z" />
        <ellipse className="st0" cx={13.5} cy={13.2} rx={13.3} ry={13.2} />
        <path
            className="st0"
            d="M40.1,78.9c22,0,39.9-17.7,39.9-39.5H53.4c0,7.3-6,13.2-13.3,13.2s-13.3-5.9-13.3-13.2H0.2 C0.2,61.2,18.1,78.9,40.1,78.9z"
        />
        </g>
    </svg>
    )
  }
  
  export default IconNicehash
  