import { Checkbox, FormControl, FormControlLabel, FormLabel } from "@mui/material";
import { useEffect, useState } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { IOption } from "services/types/common";

interface IMyCheckBox {
  name: string;
  control: Control<FieldValues, any>;
  label?: string;
  options: Array<IOption>;
  className?: string;
  setValue: (key: string, value: any) => void;
}

const MyCheckBox: React.FC<IMyCheckBox> = ({
  name,
  control,
  setValue,
  label,
  options,
}) => {
  const [selectedItems, setSelectedItems] = useState<any>([]);

  // we are handling the selection manually here
  const handleSelect = (value: any) => {
    const isPresent = selectedItems.indexOf(value);
    if (isPresent !== -1) {
      const remaining = selectedItems.filter((item: any) => item !== value);
      setSelectedItems(remaining);
    } else {
      setSelectedItems((prevItems: any) => [...prevItems, value]);
    }
  };

  // we are setting form value manually here
  useEffect(() => {
    setValue(name, selectedItems); 
  }, [selectedItems]);

  return (
    <FormControl size={"small"} variant={"outlined"}>
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <div>
        {options && options.map((option: any) => {
          return (
            <FormControlLabel
              control={
                <Controller
                  name={name}
                  render={({}) => {
                    return (
                      <Checkbox
                        checked={selectedItems.includes(option.value)}
                        onChange={() => handleSelect(option.value)}
                      />
                    );
                  }}
                  control={control}
                />
              }
              label={option.label}
              key={option.value}
            />
          );
        })}
      </div>
    </FormControl>
  );
};

export default MyCheckBox;