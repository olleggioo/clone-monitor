import Icon from '../../assets/icons/promminer.svg'

const IconPromminer = ({
  width,
  height,
  ...props
}: {
  width: number
  height: number
  [x: string]: any
}) => {
  return (
    <Icon
      width={width}
      height={height}
      viewBox={'0 0 ' + width + ' ' + height}
      {...props}
    />
  )
}

export default IconPromminer
