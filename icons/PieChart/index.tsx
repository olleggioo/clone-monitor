import Icon from '../../assets/icons/pie-chart.svg'

const IconPieChart = ({
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
      viewBox={'0 0 ' + width + ' ' + height}
      {...props}
    />
  )
}

export default IconPieChart
