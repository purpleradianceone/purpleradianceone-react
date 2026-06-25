import React from "react";
import { Star } from "lucide-react"; // optional icon library
import COLORS from "../../../../constants/Colors";

interface RatingProps {
  label?: string;
  logo: React.ElementType;
  required?: boolean;
  value: number;
  onChange: (val: number) => void;
  max?: number;
  labelClassName?: string;
    iconWrapperClassName?: string;
    iconContainerClassName?: string;
}

const CustomerRating: React.FC<RatingProps> = ({
  label,
  logo: Logo,
  required,
  value,
  onChange,
  max = 5,
  labelClassName = "",
  iconContainerClassName = "",
}) => {
  return (
    <div>
      <label htmlFor={label}  className={`block input-label-custom ${labelClassName}`}>
       {Logo &&
    (iconContainerClassName ? (
    <div className={`${iconContainerClassName} inline-flex mr-1`}>
      <Logo size={14} />
    </div>
  ) : (
    <Logo
      size={14}
      className={`inline mr-1 ${COLORS.PRIMARY_PURPLE}`}
    />
  ))}
        {label}
        {required && <span className="text-red-500 align-top">*</span>}
      </label>

      <div className="flex space-x-1 mt-1">
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
          <Star
            key={star}
            size={24}
            className={`cursor-pointer transition-colors ${
              star <= value ? `${COLORS.PRIMARY_PURPLE}` : "text-gray-300"
            }`}
            onClick={() => onChange(star)}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomerRating;
