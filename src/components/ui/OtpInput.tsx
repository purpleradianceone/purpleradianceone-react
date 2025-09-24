import React, { useRef, useEffect } from 'react';

interface OTPInputProps {
  length?: number;
  value: string[];
  onChange: (otp: string[]) => void;
  error?: string;
  autoFocus?: boolean;
  required:boolean;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  error,
  autoFocus = true,
  required
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, inputValue: string) => {
    const newOtp = [...value];
    newOtp[index] = inputValue;
    onChange(newOtp);

    // Move to next input if value is entered
    if (inputValue && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      // Move to previous input on left arrow
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      // Move to next input on right arrow
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
    const otpArray = [...value];
    pastedData.split('').forEach((char, index) => {
      if (index < length) {
        otpArray[index] = char.replace(/[^0-9]/g, '');
      }
    });
    onChange(otpArray);
    
    // Focus the next empty input after the pasted content
    const nextEmptyIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextEmptyIndex]?.focus();
  };

  return (
    <div>
      <label className="block input-label-custom mb-2">
        Enter your OTP{required && <span className="caption-custom-inactive align-top">*</span>}
      </label>
      <div className="flex gap-2 justify-between">
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e.target.value.replace(/[^0-9]/g, ''))}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`w-12 h-12 text-center border-2 rounded-lg input-label-custom
              ${
                error
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              } focus:ring-4 outline-none transition-all`}
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>
      {error && (
        <p className="mt-1 caption-custom-inactive">
          {error}
        </p>
      )}
    </div>
  );
}