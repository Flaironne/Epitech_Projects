import { FC } from "react";
import { PuffLoader } from "react-spinners";

const Loader: FC = () => (
  <div className="container bg-pink-01 mx-auto px-4 py-28 font-patrick">
    <PuffLoader className="mx-auto" color="#483a2e" loading size={150} />;
  </div>
);

export default Loader;
