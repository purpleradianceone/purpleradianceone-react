import React from "react";
import { Star } from "lucide-react"; // optional icon library

interface RatingProps {
  label?: string;
  logo: React.ElementType;
  required?: boolean;
  value: number;
  onChange: (val: number) => void;
  max?: number;
}

const CustomerRating: React.FC<RatingProps> = ({
  label,
  logo: Logo,
  required,
  value,
  onChange,
  max = 5,
}) => {
  return (
    <div>
      <label htmlFor={label} className="block input-label-custom">
        {Logo && <Logo size={14} className="inline mr-1 text-blue-500" />}
        {label}
        {required && <span className="text-red-500 align-top">*</span>}
      </label>

      <div className="flex space-x-1 mt-1">
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
          <Star
            key={star}
            size={24}
            className={`cursor-pointer transition-colors ${
              star <= value ? "text-blue-600" : "text-gray-300"
            }`}
            onClick={() => onChange(star)}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomerRating;
