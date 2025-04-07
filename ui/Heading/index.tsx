import { FC } from 'react'
import { HeadingI } from '@/ui/Heading/Heading'
import styles from './Heading.module.scss'
import classNames from 'classnames'

const Heading: FC<HeadingI> = ({
  text,
  size = 'md',
  tagName = 'h2',
  className,
  style,
  onClick
}) => {
  const TagName = tagName
  const headingClass = classNames(styles[`el_${size}`], className)
  return <TagName onClick={onClick} className={headingClass} style={style}>{text}</TagName>
}

export default Heading
