import { FC } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { likeProduct, Product, unlikeProduct } from "../api/product/productAPI";
import { HeartIcon, TrashIcon } from "@heroicons/react/16/solid";
import { useUser } from "../contexts/UserContext.tsx";
import { addProduct, removeProduct } from "../api/carts/carts.ts";

interface productCardProps {
  productType?: string;
  product: Product;
  cart?: boolean;
  singleProduct?: boolean;
}

const ProductCard: FC<productCardProps> = (props) => {
  const { cart = false, productType, product, singleProduct } = props;

  const { user, token } = useUser();

  const isLiked = user?.favorites.some((fav) => fav.id === product.id);

  const like = () => {
    if (user) {
      likeProduct(product.id, token).then(() => {
        location.reload();
      });
    }
  };

  const add = () => {
    addProduct(token, product.id).then(() => {
      location.reload();
    });
  };

  const remove = () => {
    removeProduct(token, product.id).then(() => {
      location.reload();
    });
  };

  const unlike = () => {
    if (user) {
      unlikeProduct(product.id, token).then(() => {
        location.reload();
      });
    }
  };

  return (
    <div
      className="bg-pink-01 rounded-lg border border-black font-lato mb-4"
      data-test="product-card"
      style={{ height: "400px", minWidth: "auto", flex: singleProduct ? 1 : 0 }}
    >
      <div className="text-center border-b border-gray-200 flex justify-center">
        <Link
          to={"/products/" + product.id}
          className="text-xl font-bold font-patrick"
        >
          <div>
            <img
              className="inline-block h-60"
              src={`data:image/png;base64, ${product.image}`}
            />
          </div>
        </Link>
      </div>
      <div className="px-8 pt-4">
        <p className="text-gray-500 text-[14px] font-medium">category</p>
        <Link
          className="font-semibold hover:underline"
          to={{ pathname: `/product/` }}
        >
          {product.name}
        </Link>
      </div>
      <div className="px-8"></div>
      <div className="flex items-center justify-between px-8 pb-4 flex-wrap">
        {product.price + " cents"}
        <div className="flex gap-4">
          <button
            type="button"
            className={
              "flex items-center space-x-2 hover:bg-brown-01 text-white py-2 px-4 rounded bg-pink-500" +
              (cart ? " bg-red-500" : "")
            }
            data-test="add-cart-btn"
            onClick={cart ? remove : add}
          >
            {cart ? (
              <>
                <TrashIcon className="h-5 w-5" />
              </>
            ) : (
              <>
                <AiOutlineShoppingCart className="h-5 w-5" />
                <span>Add to cart</span>
              </>
            )}
          </button>
          {user && (
            <button
              type="button"
              className={
                "flex items-center space-x-2 hover:bg-brown-01 text-white py-2 px-4 rounded bg-pink-500 cursor-pointer" +
                (isLiked ? " bg-red-500" : "")
              }
              onClick={isLiked ? unlike : like}
              data-test="add-cart-btn"
            >
              <HeartIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
