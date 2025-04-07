import { TabControlI } from '@/components/TabsControls/TabsControls'
import { TogglesItemI } from '../Toggles/Toggles'

export interface ChartWithControlsI {
  deviceId?: string
  tabControls: TabControlI[]
  toggles?: TogglesItemI[]
  algorithm?: string
  modelId?: string
}
