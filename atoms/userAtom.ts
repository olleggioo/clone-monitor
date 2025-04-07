import { atom } from 'jotai'
import { UserI } from '@/interfaces'

export const userAtom = atom<UserI | null>(null)
export const usersAtom = atom<UserI[]>([])
