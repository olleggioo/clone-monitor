export interface CodeFieldI {
  error?: boolean
  onChange?: () => void
  onClear?: () => void
  onComplete?: (code: string) => void
}
