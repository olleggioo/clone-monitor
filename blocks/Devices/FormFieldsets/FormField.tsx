import { FieldsType } from '@/data/devicesForms'
import { Heading, CustomSelect, Field } from '@/ui'
import styles from './FormFieldsets.module.scss'
import { FC } from 'react'
import { FormFieldsetsI } from './FormFieldsets'
import { FormDeviceUsers } from './FormDeviceUsersets'

const FormFieldDeviceUser: FC<FormDeviceUsers> = ({
  fields,
  values,
  handleUpdateState
}) => {
  return (
    <div className={styles.el}>
      {/* {fields.map((fieldset: any) => ( */}
        <div className={styles.fieldset} key={fields.title}>
          {fields.fields.map((field: FieldsType, index: number) => {
            switch (field.type) {
              case 'select':
                return (
                  <CustomSelect
                    key={field.name}
                    options={field.options}
                    selectedOption={values[field.name]}
                    onChange={(option: any) => handleUpdateState(field.name, option)}
                    label={field.label}
                  />
                )
            }
          })}
        </div>
      {/* ))} */}
    </div>
  )
}
export default FormFieldDeviceUser
