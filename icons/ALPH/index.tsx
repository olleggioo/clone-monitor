import { he } from 'date-fns/locale'
import Icon from '../../assets/icons/ALPH.svg'

const IconALPH = ({
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
    viewBox="0 0 1000 1000"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    xmlSpace="preserve"
    // xmlns:serif="http://www.serif.com/"
    style={{
      fillRule: "evenodd",
      clipRule: "evenodd",
      strokeLinejoin: "round",
      strokeMiterlimit: 2,
    }}
    {...props}
  >
    <rect
      id="Plan-de-travail1"
    //   serif:id="Plan de travail1"
      x={0}
      y={0}
      width={1000}
      height={1000}
      style={{
        fill: "none",
      }}
    />
    <g>
      <path
        d="M433.333,608.163c0,-8.784 -6.916,-14.694 -15.433,-13.193l-102.466,18.065c-8.518,1.502 -15.434,9.852 -15.434,18.634l0,193.53c0,8.782 6.916,14.694 15.434,13.192l102.466,-18.065c8.517,-1.501 15.433,-9.851 15.433,-18.634l0,-193.529Z"
        style={{
          fillRule: "nonzero",
        }}
      />
      <path
        d="M700,174.802c0,-8.783 -6.916,-14.694 -15.434,-13.193l-102.466,18.065c-8.518,1.502 -15.433,9.852 -15.433,18.635l-0,193.529c-0,8.783 6.915,14.694 15.433,13.192l102.466,-18.064c8.518,-1.502 15.434,-9.852 15.434,-18.635l0,-193.529Z"
        style={{
          fillOpacity: 0.6,
          fillRule: "nonzero",
        }}
      />
      <path
        d="M450.025,220.009c-3.956,-8.713 -14.577,-14.48 -23.704,-12.871l-109.785,19.356c-9.127,1.609 -13.324,9.988 -9.368,18.701l242.807,534.774c3.956,8.712 14.577,14.48 23.704,12.87l109.785,-19.354c9.126,-1.609 13.324,-9.99 9.368,-18.702l-242.807,-534.774Z"
        style={{
          fillRule: "nonzero",
        }}
      />
    </g>
  </svg>
  )
}

export default IconALPH
