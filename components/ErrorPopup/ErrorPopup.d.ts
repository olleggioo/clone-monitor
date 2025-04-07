export interface ErrorPopupI {
  text: string
  className?: string
  onClose?: () => void
  isSuccess?: boolean
}
