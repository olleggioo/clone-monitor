import { IconAperture, IconChip } from '@/icons'

export type IconType = 'chip' | 'cooler' | null

const RenderIcon = (icon: IconType) => {
  switch (icon) {
    case 'chip':
      return <IconChip width={20} height={20} />
    case 'cooler':
      return <IconAperture width={20} height={20} />
    default:
      return <></>
  }
}

export default RenderIcon
