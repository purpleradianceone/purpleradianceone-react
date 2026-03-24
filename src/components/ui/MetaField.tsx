import React from "react";

interface MetaFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value?: React.ReactNode;
}

const MetaField: React.FC<MetaFieldProps> = ({
  label,
  value,
  className = "",
  ...props
}) => {
  return (
    <div className={`${className}`} {...props}>
      <label className="caption-custom">{label}</label>
      <p className="input-label-custom">{value ?? "-"}</p>
    </div>
  );
};

export default MetaField;
