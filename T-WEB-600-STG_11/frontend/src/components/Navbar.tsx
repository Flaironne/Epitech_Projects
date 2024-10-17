import { FC, useState, useEffect } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import LoginModal from "./LoginModal";
import { Product, search } from "../api/product/productAPI.ts";
import { useUser } from "../contexts/UserContext.tsx";

const Navbar: FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const location = useLocation(); // Hook pour accéder à l'objet de localisation
  const navigate = useNavigate(); // Hook pour naviguer dans l'application

  const [searchItems, setSearchItems] = useState<Product[]>([]); // État pour la recherche

  const { token } = useUser();

  const { user } = useUser();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;

    if (!v || v.length < 2) return setSearchItems([]);

    search(v).then((data) => {
      if (!data) setSearchItems([]);
      setSearchItems(data);
    });
  };

  const toggleLoginModal = () => setShowLoginModal(!showLoginModal);

  const handleCartClick = () => {
    navigate("/cart");
  };

  // Ferme la modale à chaque changement de route
  useEffect(() => {
    setShowLoginModal(false);
  }, [location.pathname]); // Dépendance au chemin pour déclencher l'effet

  useEffect(() => {
    if (token) {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, [token]);

  return (
    <div className="py-4 bg-brown-02 top-0 sticky z-10 shadow-lg font-karla">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="text-4xl font-bold"
            data-test="main-logo"
            onClick={() => setShowLoginModal(false)}
          >
            <img className="h-16 w-auto" src={logo} alt="logo" />
          </Link>
          <div className="relative">
            <div className="lg:flex hidden w-full max-w-[500px]">
              <input
                type="text"
                onChange={handleSearch}
                placeholder="Search for a product..."
                className="border-2 rounded-full border-brown-01 px-6 py-2 w-full"
              />
            </div>
            <div>
              {searchItems.length > 0 && (
                <div className="absolute top-[4.4rem] w-full bg-white border border-brown-01 rounded-b-lg">
                  {searchItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 hover:bg-gray-100 hover:cursor-pointer flex items-center bg-white rounded-b-lg"
                      onClick={() => {
                        navigate(`/products/${item.id}`);
                        setSearchItems([]);
                      }}
                    >
                      <p>{item.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-4 md:gap-8 items-center">
            {user && user.is_admin && (
              <Link
                to="/administration"
                className="text-xl font-bold font-patrick"
              >
                Adminstration
              </Link>
            )}
            <Link to="/products" className="text-xl font-bold font-patrick">
              Products
            </Link>
            <Link to="/accessories" className="text-xl font-bold font-patrick">
              Accessory
            </Link>
            <button
              onClick={isLogged ? () => navigate("/profil") : toggleLoginModal}
              className="text-xl font-bold font-patrick"
            >
              {isLogged ? "Profil" : "Login"}
            </button>
            <div
              className="text-brown-01 text-[32px] relative hover:cursor-pointer hover:opacity-80"
              data-test="cart-btn"
              onClick={handleCartClick}
            >
              <AiOutlineShoppingCart />
            </div>
          </div>
        </div>
      </div>
      {showLoginModal && (
        <LoginModal onPress={() => setShowLoginModal(false)} />
      )}
    </div>
  );
};

export default Navbar;
