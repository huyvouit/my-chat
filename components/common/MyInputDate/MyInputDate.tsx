import DateFnsUtils from "@date-io/date-fns";
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { useMemo } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { common } from "utils/common";
import styles from './MyInputRadio.module.scss';

interface IMyInputDate {
  name: string;
  control: Control<FieldValues, any>;
  label: string;
  className?: string;
  value?: string;
  validator?: any;
  fullWidth?: boolean;
}

const MyInputDate: React.FC<IMyInputDate> = ({ 
  name,
  control,
  label,
  className,
  value,
  validator,
  fullWidth,
}) => {
  
  const uuid = useMemo(() => {
    return common.uuidv4();
  }, []);

  return (
    <div className={`${styles[`my-input-date`]} ${
      fullWidth ? styles[`my-input-date--fullwidth`] : ``
    } ${className}`}>
      <LocalizationProvider utils={DateFnsUtils}>
        <Controller
          name={name}
          control={control}
          defaultValue={value}
          rules={validator}
          render={({ field : {onChange , value } }) => (
            <DatePicker
              onChange={onChange}
              value={value}
              label={label}
            />
          )}
        />
      </LocalizationProvider>
    </div>
  );
};

export default MyInputDate;