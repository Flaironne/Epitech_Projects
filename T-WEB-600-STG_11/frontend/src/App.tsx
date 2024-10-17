import Navbar from "./components/Navbar";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContactUs from "./pages/ContactUs";
import SingleProduct from "./pages/SingleProduct";
import AllProducts from "./pages/AllProducts";
import AllAccessories from "./pages/AllAccessories";
import ShoppingCart from "./pages/ShoppingCart";
import Profil from "./pages/Profil";
import Administration from "./pages/Administration";
import { useUser } from "./contexts/UserContext.tsx";
import Error404 from "./pages/Error404.tsx";
import Partnership from "./pages/Partnership.tsx";

function App() {
  const { user } = useUser();

  return (
    <div className="bg-brown-02">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/accessories" element={<AllAccessories />} />
        <Route path="/products/:productId" element={<SingleProduct />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<ContactUs />} />
        {user && (
          <>
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/profil" element={<Profil />} />
            {user.is_admin && (
              <Route path="/administration" element={<Administration />} />
            )}
          </>
        )}
        <Route path="*" element={<Error404 />} />
        <Route path="/partnership" element={<Partnership />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
