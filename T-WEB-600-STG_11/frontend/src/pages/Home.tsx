import { FC } from "react";
import HeroSection from "../components/HeroSection";
import ProductList from "../components/ProductList";

const Home: FC = () => {

  return (
    <div className="bg-brown-02 min-h-screen">
      <HeroSection />
      <ProductList />

    </div>
  );
};

export default Home;
