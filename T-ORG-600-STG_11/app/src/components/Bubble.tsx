import React from "preact/compat";

import { Person } from "../types";

import { Join } from "./Join";

interface BubbleProps {
  person: Person;
}

export function Bubble(props: BubbleProps) {
  const { person } = props;

  return (
    <>
      <Container>
        <Portrait image={person.image} />
        <Presentation
          name={person.name}
          fonction={person.fonction}
          service={person.service}
        />
      </Container>
      {person.subordinates && person.subordinates.length > 0 && <Join />}
    </>
  );
}

interface ContainerProps {
  children: React.ReactNode;
}

function Container(props: ContainerProps) {
  const { children } = props;

  return <div class={"bubble"}>{children}</div>;
}

interface PortraitProps {
  image: string;
}

function Portrait(props: PortraitProps) {
  const { image } = props;

  return (
    <div class={"portrait"}>
      <img src={image} />
    </div>
  );
}

interface JobProps {
  service: string;
  fonction: string;
}

function Job(props: JobProps) {
  const { service, fonction } = props;

  return (
    <div class={"job"}>
      {service} - {fonction}
    </div>
  );
}

interface PresentationProps {
  name: string;
  fonction: string;
  service: string;
}

function Presentation(props: PresentationProps) {
  const { name, fonction, service } = props;

  return (
    <div class={"presentation"}>
      <h3 class={"name"}>{name}</h3>
      <Job service={service} fonction={fonction} />
    </div>
  );
}
