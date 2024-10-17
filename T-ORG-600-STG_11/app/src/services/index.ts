import { Chart, Person } from "../types";

export const withSubordinates = (chart: Chart): Chart => {
  let chartWithSubordinates = {
    persons: chart.persons.map((person) => {
      return withRelation(person, chart);
    }),
  };

  return {
    persons: chartWithSubordinates.persons.filter((person) => {
      return person.isTop;
    }),
  };
};

const withRelation = (person: Person, chart: Chart): Person => {
  const persons = chart.persons.filter((p) =>
    // @ts-ignore
    person.subordinates.includes(p.id)
  );

  return {
    ...person,
    subordinates: persons.map((p) => withRelation(p, chart)),
  };
};
