import { DeviceI, DeviceStatusI } from '@/interfaces'

export interface DevicesTabsI {
  statuses: DeviceStatusI[]
  // filterStatus?: string
  filterStatus?: any[]
  onTabChange: (id: string | null) => void
  onCountChange: (newCount: number) => void
}
