
const IconEMCD = ({
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
        viewBox="0 0 35 35"
        id="svg4"
        // sodipodi:docname="EMCD \u2014 \u043A\u043E\u043Fddd\u0438\u044F.svg"
        width={width}
        height={height}
        // inkscape:version="1.4 (86a8ad7, 2024-10-11)"
        // xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
        // xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        xmlns="http://www.w3.org/2000/svg"
        // xmlns:svg="http://www.w3.org/2000/svg"
        {...props}
    >
        <defs id="defs4">
        <linearGradient id="swatch4" 
        // inkscape:swatch="solid"
        >
            <stop
            style={{
                stopColor: "#ffffff",
                stopOpacity: 1,
            }}
            offset={0}
            id="stop4"
            />
        </linearGradient>
        <linearGradient
            // inkscape:collect="always"
            xlinkHref="#swatch4"
            id="linearGradient4"
            x1={2.8098762}
            y1={14.940489}
            x2={27.110119}
            y2={14.940489}
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(2.5885618,2.4993011)"
        />
        </defs>
        {/* <sodipodi:namedview
        id="namedview4"
        pagecolor="#ffffff"
        bordercolor="#000000"
        borderopacity={0.25}
        inkscape:showpageshadow={2}
        inkscape:pageopacity={0}
        inkscape:pagecheckerboard={0}
        inkscape:deskcolor="#d1d1d1"
        inkscape:zoom={33.609396}
        inkscape:cx={15.02556}
        inkscape:cy={17.39097}
        inkscape:window-width={2520}
        inkscape:window-height={1574}
        inkscape:window-x={-11}
        inkscape:window-y={-11}
        inkscape:window-maximized={1}
        inkscape:current-layer="svg4"
        /> */}
        <ellipse
        style={{
            fill: "#000000",
            strokeWidth: 1.26351,
        }}
        id="path5"
        cx={17.48023}
        cy={17.539738}
        rx={17.509985}
        ry={17.450478}
        />
        <path
        clipRule="evenodd"
        d="m 12.697857,6.4398402 c -0.10625,0 -0.20039,0.06785 -0.23325,0.168023 L 8.2550871,19.44654 c -0.03625,0.1105 0.04691,0.2238 0.16414,0.2238 h 0.23865 l 8e-5,10e-5 H 20.990337 c 0.1056,0 0.1994,-0.0669 0.2327,-0.1662 l 1.3304,-3.95794 c 0.053,-0.15746 -0.0653,-0.31997 -0.2327,-0.31997 h -6.8392 c -0.16814,0 -0.2865,-0.16386 -0.23217,-0.32164 l 1.32857,-3.85621 c 0.0339,-0.09834 0.1273,-0.16451 0.2322,-0.16451 h 11.3473 c 0.1063,0 0.2006,-0.06784 0.2333,-0.1681 l 1.2958,-3.9579058 c 0.0514,-0.157062 -0.0668,-0.318124 -0.2334,-0.318124 h -11.2873 -5.09199 z M 6.9422271,23.99574 c -0.10633,0 -0.20047,0.0677 -0.23333,0.1679 l -1.298238,3.9579 c -0.05159,0.1571 0.06661,0.3182 0.233247,0.3182 H 22.398237 c 0.1062,0 0.2003,-0.0677 0.2333,-0.1677 l 1.3032,-3.9579 c 0.0518,-0.1571 -0.0663,-0.3184 -0.2331,-0.3184 z"
        fillRule="evenodd"
        id="path4"
        // sodipodi:nodetypes="sccsccsccssccssccsccssccssccss"
        style={{
            fill: "url(#linearGradient4)",
        }}
        />
    </svg>
    )
  }
  
  export default IconEMCD
  