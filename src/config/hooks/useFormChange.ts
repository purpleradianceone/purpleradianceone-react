import {  useEffect, useState } from 'react';

export const useFormChange = <T extends Record<string, string>>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);

  useEffect(() => {
    setFormData(initialState);
  }, [JSON.stringify(initialState)]); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialState);
  };

  return {
    formData,
    setFormData,
    handleChange,
    resetForm
  };
};