import Icon from '../../assets/icons/copy.svg'

const IconCopy = ({
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

export default IconCopy
