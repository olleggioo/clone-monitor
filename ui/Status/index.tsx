import { FC, useState } from 'react'
import { StatusI } from '@/ui/Status/Status'
import styles from './Status.module.scss'
import classNames from 'classnames'
import IconButton from '../IconButton'
import { IconCopy } from '@/icons'
import Link from 'next/link'

interface StatusUpdateI extends StatusI {
  description?: string
  additionalDescription?: string
  href?: string
  style?: any
  place?: string
  id?: string
  
}

const Status: FC<StatusUpdateI> = ({ 
  id,
  onClick, 
  href, 
  state, 
  correctTitle, 
  title, 
  tagName = 'span', 
  className, 
  description, 
  additionalDescription, 
  style,
  place 
}) => {
  const Tag = tagName
  const statusClass = classNames(styles.el, styles[`el_${state}`], className)
  const [copied, setCopied] = useState(false)
  const copyToClipboard = (text: any) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(err => {
        console.error('Ошибка копирования в буфер обмена:', err)
      });
  };

  return (
    <Tag className={statusClass}>
      <div>
        {id 
          ? <Link href={`/devices/${id}`} className={styles.text} style={style}>{correctTitle || title}</Link> 
          : <p className={styles.text} onClick={onClick} style={style}>{correctTitle || title}</p>
        }
        {description && <div className={styles.description}>
          <p onClick={() => {
              navigator.clipboard.writeText(description.substring(4))
              .then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 1000)
              })
              .catch(err => {
                console.error('Ошибка копирования в буфер обмена:', err)
              });
              
            }}>{description}</p>
        </div>}
        
        {additionalDescription && 
        <div className={styles.additionDescription}>
        <a href={href + additionalDescription} target='_blank'>
          {"IP: " + additionalDescription}
        </a>
        <IconButton 
          icon={<IconCopy width={20} height={20} />}
          onClick={() => {
            navigator.clipboard.writeText(additionalDescription)
            .then(() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 1000)
            })
            .catch(err => {
              console.error('Ошибка копирования в буфер обмена:', err)
            });
          }}
        />
        </div>
        
        }
        {additionalDescription && <div className={styles.description}>
          {place && place.length > 0 && <p>Место: {place}</p>}  
        </div>}
      </div>
      {copied && <div className={styles.copyStatus}>Скопировано</div>}
    </Tag>
  )
}

export default Status
