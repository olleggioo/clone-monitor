import { atom } from 'jotai'

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

export const deviceAtom = atom<DeviceType>('desktop')
export const sidebarStatus = atom<boolean>(true)