import { he } from 'date-fns/locale'
import Icon from '../../assets/icons/CKB.svg'

const IconCKB = ({
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
    viewBox="0 0 207.7 206.3"
    // style={{
    //   enableBackground: "new 0 0 207.7 206.3",
    // }}
    xmlSpace="preserve"
    {...props}
  >
    <g id="logoMark">
      <polygon
        id="logoMark_PathItem_"
        points="0,0 0,206.3 53.2,206.3 53.2,93.9 93.9,93.9  "
      />
      <polygon
        id="logoMark_PathItem_2"
        points="154.5,0 154.5,112.4 113.8,112.4 207.7,206.3 207.7,0  "
      />
    </g>
  </svg>
  )
}

export default IconCKB
