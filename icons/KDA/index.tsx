import { he } from 'date-fns/locale'
import Icon from '../../assets/icons/LTC.svg'

const IconKDA = ({
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
    viewBox="0 0 236 211"
    fill="none"
    id="svg9"
    // sodipodi:docname="Kadena - Vertical - Light.svg"
    // inkscape:version="1.4 (86a8ad7, 2024-10-11)"
    // xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
    // xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
    xmlns="http://www.w3.org/2000/svg"
    // xmlns:svg="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs id="defs9" />
    {/* <sodipodi:namedview
      id="namedview9"
      pagecolor="#ffffff"
      bordercolor="#000000"
      borderopacity={0.25}
      inkscape:showpageshadow={2}
      inkscape:pageopacity={0}
      inkscape:pagecheckerboard={0}
      inkscape:deskcolor="#d1d1d1"
      inkscape:zoom={4.3733382}
      inkscape:cx={150.91447}
      inkscape:cy={82.202653}
      inkscape:window-width={2880}
      inkscape:window-height={1586}
      inkscape:window-x={3769}
      inkscape:window-y={-11}
      inkscape:window-maximized={1}
      inkscape:current-layer="svg9"
    /> */}
    <g
      id="g9"
      transform="matrix(1.5010998,0,0,1.5010998,-60.403976,0.30060062)"
    >
      <path
        d="m 190.815,139.975 h -50.577 l -0.033,-0.025 -0.399,-0.308 -62.6771,-48.9233 25.6531,-20.5753 87.609,69.4986 z"
        fill="#4a9079"
        id="path7"
      />
      <path
        d="m 190.815,0.312744 h -50.577 l -0.033,0.02494 -0.399,0.30759 L 77.1289,49.5688 102.782,70.1441 190.391,0.645274 Z"
        fill="#4a9079"
        id="path8"
      />
      <path
        d="m 77.1375,73.2449 v 17.4246 0.0582 l 0.0083,48.9153 v 0.332 l -0.0332,-0.024 -0.3901,-0.308 -30.5004,-24.109 -0.0747,-0.058 -0.4399,-0.341 V 25.1528 l 0.4399,-0.3409 0.0747,-0.0582 30.5004,-24.108426 0.3901,-0.30759 0.0332,-0.02494 v 0.33253 L 77.1375,49.5605 v 0.0582 20.5254 z"
        fill="#4a9079"
        id="path9"
      />
    </g>
  </svg>
  )
}

export default IconKDA
