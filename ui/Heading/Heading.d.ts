export type HeadingSizeType = 'xl' | 'lg' | 'md' | 'sm'
export type HeadingTagNameType =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'label'
  | 'p'
  | 'span'

export interface HeadingI {
  text: string
  size?: HeadingSizeType
  tagName?: HeadingTagNameType
  className?: string
  style?: any
  onClick?: any
}
