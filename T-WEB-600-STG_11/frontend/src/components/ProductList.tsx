import { FC } from "react";
import { useQuery } from "react-query";
import Carousel from "./Carousel";
import { fetchAllProducts, Product } from "../api/product/productAPI";

const ProductList: FC = () => {

  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[]>("products", fetchAllProducts);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 pr-2">
        <h2 className="text-4xl font-medium font-patrick mb-4">
          Choose your Pal
        </h2>
        {products && (
          <Carousel
            itemsPerSlide={1}
            productList={products.filter(
              (product: Product) => product.accessory === false
            )}
          />
        )}
      </div>
      <div className="w-px bg-black opacity-50 my-4" />
      <div className="w-full lg:w-1/2 pl-2">
        <h2 className="text-4xl font-medium font-patrick mb-4">
          Choose your Accessory
        </h2>
        <div className="hidden lg:block">
          {products && (
            <Carousel
              itemsPerSlide={2}
              productList={products.filter(
                (product: Product) => product.accessory === true
              )}
            />
          )}
        </div>
        <div className="block lg:hidden">
          {products && (
            <Carousel
              itemsPerSlide={1}
              productList={products.filter(
                (product: Product) => product.accessory === true
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
