/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { STRING_VALUES } from '../../constants/AppConstants';

export const useFormChange = <T extends Record<string, string | number | boolean | number[] | undefined>>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);

  useEffect(() => {
    setFormData(initialState);
  }, [JSON.stringify(initialState)]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'isActive') {
      setFormData(prevFormData => ({ ...prevFormData, [name]: convertToBoolean(value) }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const resetForm = () => {
    setFormData(initialState);
  };

  const convertToBoolean = (value: string) => {
    switch (value.toLowerCase()) {
      case STRING_VALUES.TRUE:
        return true;
      case STRING_VALUES.FALSE
        : return false;
    }
  }

  return {
    formData,
    setFormData,
    handleChange,
    resetForm
  };
};