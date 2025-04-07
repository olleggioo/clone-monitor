export interface TabsControlsI {
  items: TabsControlI[]
  currentTab: any
  onChange: (value: string, id?: string) => void
  modelId?: string
  onChangeChartData?: (value: []) => void
  abortController?: any
  setDate?: any
}

export interface TabsControlI {
  text: string
  id?: string
  mod?: string
  count?: number
}
