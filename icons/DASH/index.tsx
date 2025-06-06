import { he } from 'date-fns/locale'
import Icon from '../../assets/icons/DASH.svg'

const IconDASH = ({
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
    viewBox="0 0 2000 2000"
    width={width}
    height={height}
    {...props}
  >
    <circle cx={1000} cy={1000} r={1000} fill="#2573c2" />
    <g fill="#fff">
      <path d="M1652.6 736.8a143.65 143.65 0 0 0-19.2-63.6c-10-20-27.8-35.6-48.6-43.6a143.51 143.51 0 0 0-68.4-15H628.8l-63.6 190.6h804.2l-127 389.6h-804l-63.6 190.6h891.8a246.33 246.33 0 0 0 77.8-15c25-14.2 53.6-28.6 77.8-48.6a382.69 382.69 0 0 0 63.6-63.6 432.2 432.2 0 0 0 39.2-73.4l117.8-370.4a137.38 137.38 0 0 0 9.8-77.6z" />
      <path d="M882.2 911.6H409l-63.6 176.2h478z" />
    </g>
  </svg>
  )
}

export default IconDASH
