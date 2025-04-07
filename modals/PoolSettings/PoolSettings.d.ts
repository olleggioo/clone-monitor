interface PoolSettingsFieldsetStateI {
  [x: string]: string | boolean
}

export interface PoolSettingsModalState {
  [x: string]: PoolSettingsFieldsetStateI
}

export interface PoolSettingsModalI {
  id: string | undefined
  onClose?: () => void
}
