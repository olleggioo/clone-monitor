import { atom } from 'jotai'
import { UserI } from '@/interfaces'

export const usersListAtom = atom<UserI[]>([])
export const rolesListAtom = atom<any[]>([])