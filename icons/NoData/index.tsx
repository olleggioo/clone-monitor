import { he } from 'date-fns/locale'
import Icon from '../../assets/icons/LTC.svg'

const IconNoData = ({
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
    viewBox="0 0 192 192"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    {...props}
  >
    <path
      stroke="#000000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={12}
      d="M96 170c40.869 0 74-33.131 74-74 0-40.87-33.131-74-74-74-40.87 0-74 33.13-74 74 0 40.869 33.13 74 74 74Z"
    />
    <path
      stroke="#000000"
      strokeLinecap="round"
      strokeWidth={12}
      d="M122.87 122.87A37.998 37.998 0 0 1 58 96a38 38 0 0 1 64.87-26.87"
    />
  </svg>
  )
}

export default IconNoData
