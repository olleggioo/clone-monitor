import { FieldsType } from '@/data/devicesForms'
import { Heading, CustomSelect, Field } from '@/ui'
import styles from './FormFieldsets.module.scss'
import { FC } from 'react'
import { FormFieldsetsI } from './FormFieldsets'
import MultiSelectUser from '@/components/MultiSelect/User'

const FormFieldsets: FC<FormFieldsetsI> = ({
  fields,
  values,
  handleChangeInput,
  handleUpdateState,
  style,
  required,
  handleSearchValue,
  onBlur
}) => {
  const isStyle = styles ? {marginTop: "10px"} : {}
  return (
    <div className={styles.el} style={style}>
      {fields.map((fieldset) => (
        <div className={styles.fieldset} key={fieldset.title}>
          <Heading text={fieldset.title} style={isStyle} />

          {fieldset.fields.map((field: FieldsType, index) => {
            switch (field.type) {
              case 'select':
                return (
                  <CustomSelect
                    key={field.name}
                    disabled={field.disabled}
                    options={field.options}
                    selectedOption={values[field.name]}
                    onChange={(option: any) => {
                      handleUpdateState(field.name, option)
                    }}
                    label={field.label}
                  />
                )
              case 'multi-select':
                return (
                  <MultiSelectUser 
                      disabled={field.disabled}
                      options={field.options}
                      selectedOption={values[field.name]}
                      label='Клиенты'  
                      onChange={(option: any, test: any) => {
                        handleUpdateState(field.name, test)
                      }}
                      className={styles.field_large}
                    />
                )
              case 'row':
                return (
                  <div
                    className={styles.row}
                    key={`row-${index}-${field.fields.length}`}
                  >
                    {field.fields.map((rowField: any) => (
                      <Field
                        id={rowField.name}
                        key={rowField.name}
                        disabled={field.disabled}
                        value={values[rowField.name]}
                        label={rowField.label}
                        type="text"
                        onChange={handleChangeInput}
                      />
                    ))}
                  </div>
                )
              case 'number':
                return (
                    <Field
                      id={field.name}
                      key={field.name}
                      disabled={field.disabled}
                      value={values[field.name]}
                      label={field.label}
                      type="number"
                      onChange={handleChangeInput}
                    />
                )
              default:
                return (
                  <Field
                    id={field.name}
                    key={field.name}
                    disabled={field.disabled}
                    value={values[field.name]}
                    label={field.label}
                    onBlur={onBlur}
                    type="text"
                    onChange={handleChangeInput}
                  />
                )
            }
          })}
        </div>
      ))}
    </div>
  )
}
export default FormFieldsets
