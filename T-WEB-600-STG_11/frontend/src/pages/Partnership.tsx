import { FC } from "react";
import tuboshop from "../assets/tuboshop-spring.png";

const Partnership: FC = () => {
  return (
    <div className="container bg-pink-01 mx-auto px-4 py-28 font-patrick">
      <h1 className="text-3xl font-bold text-center">- TUBO SHOP -</h1>
      <div className="flex justify-center">
        <a
          href="https://www.tuboshop.com"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity duration-300 ease-in-out"
        >
          <img
            src={tuboshop}
            alt="Tubo Shop"
            className="max-w-full h-auto shadow-lg hover:opacity-50"
          />
        </a>
      </div>
    </div>
  );
};

export default Partnership;
