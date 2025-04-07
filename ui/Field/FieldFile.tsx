import { FC, useId, useRef, useState } from 'react'
import styles from './Field.module.scss'
import { FieldI } from '@/ui/Field/Field'
import classNames from 'classnames'
import { IconEye, IconEyeOff } from '@/icons'
import { FileUploader } from 'react-drag-drop-files'

const FieldFile: FC<FieldI> = ({
  label,
  type = 'file',
  icon,
  error,
  disabled = false,
  autoComplete,
  onChange,
  className,
  wrapClassname,
  id: propId,
  ...props
}) => {
    const id = useId()
    const isPasswordField = type === 'password'
    const [fieldType, setFieldType] = useState(type)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const modifierClass =
    isPasswordField && icon
    ? styles.input_pass
    : !!icon
    ? styles.input_icon
    : isPasswordField && !icon
    ? styles.input_passNoIcon
    : null

    const innerClass = classNames(styles.inner, { [styles.error]: error })
    const inputClass = classNames(styles.input, modifierClass, className)
    const wrapClass = classNames(styles.el, wrapClassname)

    const handleFieldTypeToggle = () => {
        setFieldType((prevState) =>
        prevState === 'password' ? 'text' : 'password'
        )
    }

    return (
        <FileUploader
            label="Загрузите файл формата .csv"
            multiple={false}
            handleChange={onChange}
            name="file"
            types={["csv"]}
        >
        </FileUploader>
    )
}

export default FieldFile
