// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useCallback } from "react";

// type AsyncFunction<T = any> = () => Promise<T>;

// interface UseAsyncSubmitOptions<T> {
//   onSuccess?: (result: T) => void;
//   onError?: (error: unknown) => void;
// }

// export function useAsyncSubmit<T = any>(
//   asyncFunction: AsyncFunction<T>,
//   options?: UseAsyncSubmitOptions<T>
// ) {
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = useCallback(async () => {
    
//     if (isSubmitting) return;

//     try {
//       setIsSubmitting(true);
//       const result = await asyncFunction();
//       options?.onSuccess?.(result);
//     } catch (error) {
//       options?.onError?.(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   }, [asyncFunction, isSubmitting, options]);

//   return { handleSubmit, isSubmitting };
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";

type AsyncFunction<T = any> = () => Promise<T>;

interface UseAsyncSubmitOptions<T> {
  onSuccess?: (result: T) => void;
  onError?: (error: unknown) => void;
}

export function useAsyncSubmit<T = any>(
  asyncFunction: AsyncFunction<T>,
  options?: UseAsyncSubmitOptions<T>
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<unknown>(null);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const result = await asyncFunction();

      setData(result); // store response
      options?.onSuccess?.(result);

      return result; // also return if needed
    } catch (err) {
      setError(err);
      options?.onError?.(err);
    } finally {
      setIsSubmitting(false);
    }
  }, [asyncFunction, isSubmitting, options]);

  return {
    handleSubmit,
    isSubmitting,
    data,
    error,
  };
}
