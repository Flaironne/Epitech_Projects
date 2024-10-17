import { FC } from "react";

const HeroSection: FC = () => {
  return (
    <div className="bg-brown-02 font-lora relative w-full">
      <img src="/HeroSection.png" alt="hero" className="w-full h-1/4" />
      <div className="absolute inset-0 flex flex-col justify-start items-center space-y-4 pt-10">
        <h1 className="text-9xl font-bold text-brown-01 font-patrick">
          PalRock
        </h1>
      </div>
    </div>
  );
};

export default HeroSection;
