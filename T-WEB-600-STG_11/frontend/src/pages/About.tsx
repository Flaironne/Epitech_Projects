import { FC } from "react";

const About: FC = () => {
  return (
    <div className="container bg-pink-01 mx-auto px-4 py-8 font-patrick">
      <h1 className="text-3xl font-bold text-center mb-8">About Us</h1>
      <p className="text-lg text-center mb-8">
        PalRock was inspired by the trend of games like Pokémon and Palworld,
        combined with a passion for nature and environmental sustainability.
      </p>
      <p className="text-lg text-center mb-8">
        Learn more about our company, EQuest, our commitment to the
        environment, and our values.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
        <p>
          At EQuest and PalRock, our mission is to provide the best customer
          experience in the tech industry while contributing to environmental
          protection. We aim to offer innovative products that delight our
          customers and enhance their lives, such as handcrafted pet rocks
          that you can personalize, using high-quality materials sourced from
          France with minimal planetary impact.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Our Team</h2>
        <p>
          Our team consists of passionate individuals dedicated to pushing the
          boundaries of technology and customer service. We're proud to have a
          diverse group of professionals from all around the world, committed
          to sustainability and ethical practices in all our dealings.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Our Values</h2>
        <ul className="list-disc pl-5">
          <li>Innovation and continuous improvement</li>
          <li>
            Commitment to customer satisfaction and environmental
            sustainability
          </li>
          <li>Integrity and transparency in all our dealings</li>
          <li>Creating a positive impact in the community</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Our Commitment</h2>
        <p>
          At PalRock, we take our environmental responsibility very seriously.
          All our materials are carefully chosen for their sustainability and
          ethical sourcing, ensuring that each pet rock is as eco-friendly as
          possible. We hope you enjoy discovering and personalizing your pet
          rocks as much as we enjoyed creating them.
        </p>
      </section>
    </div>
  );
};

export default About;
