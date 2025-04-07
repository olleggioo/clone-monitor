import { Grid, TextField, Typography } from "@mui/material";
import { FC, useState } from "react";
import MultiSelect from ".";
import { SelectI } from "@/ui/CustomSelect/CustomSelect";

const MultiSelectUser:FC<SelectI> = ({
    type,
    label,
    options,
    selectedOption,
    placeholder,
    description,
    onChange,
    className,
    required = false,
    handleSearchValue,
    innerRef,
    disabled = false
}) => {
    options.sort((a: any, b: any) => {
      const labelA = a.label.toLowerCase();
      const labelB = b.label.toLowerCase();
    
      const numA = parseInt(labelA.match(/\d+/));
      const numB = parseInt(labelB.match(/\d+/));
    
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      } else if (isNaN(numA) && !isNaN(numB)) {
        return 1;
      } else if (!isNaN(numA) && isNaN(numB)) {
        return -1;
      } else {
        return labelA.localeCompare(labelB);
      }
    })
    return (
        <Grid container flexDirection="column" alignItems="center" className={className}>
          <Grid item sx={{width: "100% !important"}}>
            <MultiSelect
              type={type}
              innerRef={innerRef}
              label={label}
              disabled={disabled}
              value={selectedOption}
              sx={{ maxheight: "700px" }}
              items={options}
              onChange={onChange}
            />
          </Grid>
        </Grid>
      );
}

export default MultiSelectUser