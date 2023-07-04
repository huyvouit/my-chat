import { EValidator } from "./contants";

export const Validator: any = (key: Array<string | EValidator>, option?: { [key: string]: string }) => {
  const validate: { [key: string]: string } = {
    [EValidator.Required]: `This field is required`,
    [EValidator.Min]: `This field has min value: ${option ? option[EValidator.Min] : ''}`,
    [EValidator.Max]: `This field has max value: ${option ? option[EValidator.Max] : ''}`,
    [EValidator.MinLength]: `This field has min length: ${option ? option[EValidator.MinLength] : ''}`,
    [EValidator.MaxLength]: `This field has max length: ${option ? option[EValidator.MaxLength] : ''}`,
    [EValidator.Pattern]: `Invalid format of field`,
    [EValidator.ValueAsNumber]: `This field is only number`,
    [EValidator.ValueAsDate]: `This field is only date`,
  }

  let v: any = {};
  key.map(a => v[a] = validate[a]);
  return v;
}