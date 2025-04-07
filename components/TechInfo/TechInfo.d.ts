export interface TechInfoI {
  items: TechInfoItemI[]
  model: any
}

export interface TechInfoItemI {
  label: string
  value: string
  addInfo?: string
}
