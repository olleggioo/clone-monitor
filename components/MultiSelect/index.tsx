import { Autocomplete, Box, Button, Checkbox, Chip, TextField } from "@mui/material";
import {makeStyles} from "@mui/styles"
import ChevronDown from '@/icons/ChevronDown'
import { memo, useEffect, useRef, useState } from "react";
import { filteredNamesAtom, selectedItemSelectAtom } from "@/atoms/appDataAtom";
import { useAtom } from "jotai";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import styles from "./MultiSelect.module.scss"

export const useStyles = makeStyles((theme: any) => ({
    autocomplete: {
        "& .MuiOutlinedInput-input": {
            boxSizing: "border-box",
            padding: "6.5px 4px 0px 5px !important",
            fontFamily: "Gilroy, sans-serif !important",
            fontSize: "16px",
            borderRaduis: "9px"
        },
        "& .MuiInputBase-input::placeholder": {
            fontFamily: "Gilroy, sans-serif !important",
            fontSize: "16px"
        },
        "& .MuiFormLabel-root": {
            color: "#676767",
            fontFamily: "Gilroy, sans-serif !important",
            fontSize: "16px"
        },
        "& .MuiOutlinedInput-root": {
            height: '3rem',
            borderRadius: "9px",
            "& fieldset": {
                borderColor: "#DFDFDF", 
            },
            "&:hover fieldset": {
                borderColor: "#DFDFDF",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#DFDFDF",
                border: "1px solid "
            },
        },
        "& .MuiAutocomplete-option": {
            fontFamily: "Gilroy, sans-serif !important",
            fontSize: "16px",
            color: "#333" // цвет вашего выбора
        }
    },
  }));

function rearrangeArray(mainArray: any, subArray: any) {
    subArray.forEach((subItem: any) => {
        const index = mainArray.findIndex((item: any) => item.value === subItem.value);
        if (index !== -1) {
        const [foundItem] = mainArray.splice(index, 1);
        mainArray.unshift(foundItem);
        }
    });
    return mainArray;
}

const MultiSelect = ({ value, items, onChange, label, type = "base", disabled = false }: any) => {
    // const [arrayItems, setArrayItems] = useState(items || [])
    const [defaultValue, setDefaultValue] = useState(value || null)
    const [selectedValue, setSelectedValue] = useState(value || [])
    
    // useEffect(() => {
        //     setArrayItems(items || []);
        // }, [items]);
        useEffect(() => {
            if(value?.value === null) {
                setDefaultValue(null)
            } else {
                setDefaultValue(value)
            }
            if(value?.length === 0) {
                setSelectedValue([])
            } else {
                setSelectedValue(value)
            }
        }, [value])
    const classes = useStyles()
    // const myRef = useRef<HTMLInputElement>(null)
    // console.log("s", myRef.current?.value)
    return (
        <>
        {type === "base"
            ? <Autocomplete
                disablePortal
                // disabled
                id="combo-box-demo"
                options={items}
                value={defaultValue}
                sx={{
                    borderRadius: "40px !important"
                }}
                ListboxProps={{
                    className: styles.customScrollbar
                }}
                renderInput={(params) => <TextField sx={{
                    '& .MuiFormLabel-root': {
                        fontSize: '0.875rem',
                        color: "#6C747B"
                    },
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "9px",
                    },
                    "& .MuiAutocomplete-inputRoot": {
                        borderRadius: "9px"
                    },
                }} className={classes.autocomplete} {...params} label={label} />}
                onChange={(event: any, newValue: any) => {
                    onChange(event, newValue);
                    setDefaultValue(newValue?.label || null);
                  }}
                // isOptionEqualToValue={(option: any, value: any) => option.value === value.value}
            />
            : type === "multiple" ? <Autocomplete
            // key={JSON.stringify(arrayItems)}
            disablePortal
            multiple
            id="combo-box-demo"
            options={items}
            disableCloseOnSelect
            ListboxProps={{
                className: styles.customScrollbar
            }}
            value={selectedValue}
            renderTags={(value: any, getTagProps) => {
                if(value.length > 1) {
                    return `Выбрано ${value.length}`
                } else {
                    return `${value[0].label}`
                }
            }}
            // sx={{width: "350px"}}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={<CheckBoxOutlineBlank fontSize="small" />}
                    checkedIcon={<CheckBox />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.label}
                </li>
              )}
            
            renderInput={(params) => <TextField sx={{
                '& .MuiFormLabel-root': {
                //   fontSize: '0.875rem',
                  color: "#6C747B",
                  fontFamily: "Gilroy, sans-serif !important",

                },
              }} className={classes.autocomplete} {...params} label={label} />}
              onChange={(event, newValue: any) => {
                onChange(newValue);
                setSelectedValue(newValue);
              }}
            // isOptionEqualToValue={(option: any, value: any) => option.value === value.value}
        />
        : type === "multiple-user" 
        ? <Autocomplete
            // key={JSON.stringify(arrayItems)}
            disablePortal
            multiple
            id="combo-box-demo"
            ListboxProps={{
                className: styles.customScrollbar
            }}
            options={items}
            disableCloseOnSelect
            value={selectedValue}
            renderTags={(value: any, getTagProps) => {
                const contract = value[0].label.split(" ")
                if(value.length > 1) {
                    return `Выбрано ${value.length}`
                } else {
                    if(Number.isInteger(Number(contract[0]))) {
                        return `Дог. ${contract[0]}`
                    } else {
                        return contract.join(" ")
                    }
                }
            }}
            // sx={{width: "350px"}}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                <Checkbox
                    icon={<CheckBoxOutlineBlank fontSize="small" />}
                    checkedIcon={<CheckBox />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                />
                {option.label}
                </li>
            )}
            
            renderInput={(params) => <TextField sx={{
                '& .MuiFormLabel-root': {
                fontSize: '0.875rem',
                color: "#6C747B",
                fontFamily: "Gilroy, sans-serif !important",
                },
                "& .MuiOutlinedInput-root": {
                    borderRadius: "9px",
                    fontFamily: "Gilroy, sans-serif !important",
                },
                "& .MuiAutocomplete-inputRoot": {
                    borderRadius: "9px",
                    fontFamily: "Gilroy, sans-serif !important",
                },
            }} className={classes.autocomplete} {...params} label={label} />}
            onChange={(event, newValue: any) => {
                onChange(newValue);
                setSelectedValue(newValue);
            }}
            // isOptionEqualToValue={(option: any, value: any) => option.value === value.value}
        />
        :<Autocomplete
            disablePortal
            // disabled
            id="combo-box-demo"
            options={items}
            value={defaultValue}
            ListboxProps={{
                className: styles.customScrollbar
            }}
            // sx={{width: "350px"}}
            renderInput={(params) => <TextField sx={{
                '& .MuiFormLabel-root': {
                fontSize: '0.875rem',
                color: "#6C747B",
                fontFamily: "Gilroy, sans-serif !important",
                },
                '& .MuiInputLabel-root': {
                    fontFamily: "Gilroy, sans-serif !important",
                    fontSize: "16px",
                    color: "#6C747B"
                },
            }} className={classes.autocomplete} {...params} label={label} />}
            onChange={(event: any, newValue: any) => {
                onChange(event, newValue);
                setDefaultValue(newValue?.value || null);
            }}
            // isOptionEqualToValue={(option: any, value: any) => option.value === value.value}
        />
        }

        </>
        
      );
}

export default MultiSelect;