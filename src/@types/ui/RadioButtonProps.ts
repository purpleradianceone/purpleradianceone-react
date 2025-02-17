type RadioButtonsOption = {
    label: string;
    value: string;
    name: string;
    id: string;
    checked: boolean;
  };
  type RadioButtonsProps = {
    options: RadioButtonsOption[];
    onChange: (value : string) => void;

  };

  export default RadioButtonsProps;