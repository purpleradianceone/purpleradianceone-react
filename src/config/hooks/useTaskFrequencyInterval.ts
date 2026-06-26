function useTaskFrequencyInterval() {
  const intervalList = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    name: String(index + 1),
    isactive: true,
  }));

  return {
    isLoading: false,
    intervalList,
  };
}

export default useTaskFrequencyInterval;
