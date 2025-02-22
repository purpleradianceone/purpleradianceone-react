type RadioButtonsOption = {
    label: string;
    value: string;
    name: string;
    id: string;
    checked?: boolean;
  };
  type RadioButtonsProps = {
    options: RadioButtonsOption[];
    onChange: (event : React.ChangeEvent<HTMLInputElement>) => void;
    name? : string;
    label? : string;
    center? : boolean
  };

  export default RadioButtonsProps;