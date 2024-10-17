export type Person = {
  id: number;
  name: string;
  service: string;
  fonction: string;
  image: string;
  subordinates: number[] | Person[];
  isTop: boolean;
};

export type Chart = {
  label: string;
  persons: Person[];
};
