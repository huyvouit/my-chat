import { FormLabel, Slider } from "@mui/material";
import { useEffect, useState } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";

interface IMyInputSlider {
  name: string;
  control: Control<FieldValues, any>;
  setValue: (key: string, value: any) => void;
  label: string;
  className?: string;
}

const MyInputSlider: React.FC<IMyInputSlider> = ({
  name,
  control,
  setValue,
  label,
}) => {
  const [sliderValue, setSliderValue] = useState<number>(0);

  const handleChange = (event: any, newValue: number | number[]) => {
    setSliderValue(newValue as number);
  };

  useEffect(() => {
    if (sliderValue) {
      setValue(name, sliderValue);
    }
  }, [sliderValue]);

  return (
    <div>
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState, formState }) => (
          <Slider
            value={sliderValue}
            onChange={handleChange}
          />
        )}
      />
    </div>
  );
};

export default MyInputSlider;