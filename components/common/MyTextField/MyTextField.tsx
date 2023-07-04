import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, makeStyles, TextField } from '@mui/material';
import React, { useState } from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import { InputType } from 'utils/styled-constants';
import s from './MyTextField.module.scss';

interface IMyTextField {
  name: string;
  control: Control<FieldValues, any>;
  label?: string;
  className?: string;
  value?: string;
  validator?: any;
  fullWidth?: boolean;
  inputType?: InputType;
}

const MyTextField: React.FC<IMyTextField> = ({
  className, 
  name,
  control, 
  label,
  value,
  validator,
  fullWidth = true,
  inputType = InputType.Text,
}) => {
  const [showPassword, setShowPasword] = useState<boolean>(false);

  const handleClickShowPassword = () => {
    setShowPasword(!showPassword);
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={value}
      rules={validator}
      render={({ 
        field: { onChange, onBlur, value, ref },
        fieldState: { invalid, error },
      }) => (
        <TextField inputRef={ref}
          autoFocus
          fullWidth={fullWidth}
          className={`${className} ${s[`my-text-field`]}`} 
          onChange={onChange} 
          onBlur={onBlur}
          value={value} 
          label={label}
          error={invalid}
          helperText={error?.message}
          type={showPassword ? InputType.Text : inputType}
          InputProps={{
            endAdornment: inputType === InputType.Password ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ) : null
          }}
        />
      )}
    />
  );
};

export default MyTextField;