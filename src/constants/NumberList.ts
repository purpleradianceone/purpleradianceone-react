export type Item = {
  id: number;
  name: string;
  isActive: boolean;
};

export function range(start: number, end: number): Item[] {
  return Array.from({ length: end - start + 1 }, (_, i) => {
    const num = start + i;
    return {
      id: num,
      name: `${num}`,
      isActive: true,
    };
  });
}