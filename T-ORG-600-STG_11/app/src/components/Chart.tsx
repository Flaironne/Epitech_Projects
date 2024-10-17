import { Chart as ChartType, Person, Person as PersonType } from "../types";

import { Bubble } from "./Bubble";

interface ChartProps {
  chart: ChartType;
}

export function Chart(props: ChartProps) {
  const { chart } = props;

  return (
    <Container>
      <Card persons={chart.persons} />
    </Container>
  );
}

const Container = (props: { children: React.ReactNode }) => {
  const { children } = props;

  return <div className={"chart"}>{children}</div>;
};

const Card = (props: { persons: PersonType[] }) => {
  const { persons } = props;

  return (
    <ul>
      {persons.map((person) => (
        <li>
          <Bubble person={person} />
          {person.subordinates && person.subordinates.length > 0 && (
            <Card persons={person.subordinates as Person[]} />
          )}
        </li>
      ))}
    </ul>
  );
};
