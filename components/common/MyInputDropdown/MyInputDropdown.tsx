import { FormLabel, MenuItem, Select } from "@mui/material";
import React, { useMemo } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { IOption } from "services/types/common";
import { common } from "utils/common";
import styles from './MyInputDropdown.module.scss';

interface IMyInputDropdown {
  name: string;
  control: Control<FieldValues, any>;
  label: string;
  options: Array<IOption>;
  className?: string;
  value?: string;
  validator?: any;
  fullWidth?: boolean;
}

const MyInputDropdown: React.FC<IMyInputDropdown> = ({
  name,
  control,
  label,
  options,
  className,
  value,
  validator,
  fullWidth,
}) => {

  const uuid = useMemo(() => {
    return common.uuidv4();
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={value}
      rules={validator}
      render={({ 
        field: { onChange, value } 
      }) => (
        <div className={`${className} ${fullWidth ? styles[`my-input-dropdown--fullwidth`] : ``}`}>
          <FormLabel id={uuid}>{label}</FormLabel>
          <Select onChange={onChange} value={value}>
            {options && options.map((option) => {
              return (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              );
            })}
          </Select>
        </div>
      )}
    />
  );
};

export default MyInputDropdown;