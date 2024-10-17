import { FC } from "react";
import error404 from "../assets/error404.png";

const Error404: FC = () => {
  return (
    <div className="container bg-pink-01 mx-auto px-4 py-28 font-patrick">
      <h1 className="text-3xl font-bold text-center">Error 404</h1>
      <p className="text-center">Page not found</p>
      <div className="flex justify-center">
        <img src={error404} alt="Not Found" className="max-w-full h-auto" />
      </div>
    </div>
  );
};

export default Error404;
