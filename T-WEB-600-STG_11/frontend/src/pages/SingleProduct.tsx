import { FC } from "react";
import { useParams } from "react-router-dom";
import {
  Product,
  fetchAllProducts,
  fetchProductById,
} from "../api/product/productAPI";
import { useQuery } from "react-query";
import ProductCard from "../components/ProductCard";
import Carousel from "../components/Carousel";

const SingleProduct: FC = () => {
  let { productId } = useParams();

  let pId = Number(productId);

  const { data: product, isLoading } = useQuery(["product", productId], () =>
    fetchProductById(pId)
  );

  const { data: products, isLoading: isLoadingProducts } = useQuery(
    ["products"],
    () => fetchAllProducts()
  );

  return (
    <div
      className="container mx-auto bg-brown-02 min-h-screen p-5 w-full flex flex-col gap-4"
      data-test="product-card"
    >
      <div className="flex flex-col md:flex-row gap-4">
        {product && <ProductCard product={product} singleProduct={true} />}
        <div
          className="flex-1 rounded-lg border border-black p-6"
          style={{ height: "400px", minWidth: "auto" }}
        >
          <div className="gap ">
            <span className="font-bold">Description : </span>
            <div>{product?.description}</div>
          </div>
        </div>
      </div>
      <div className="w-full mb-16 pl-2 mt-6">
        {!product?.accessory ? (
          <>
            <h2 className="text-4xl font-medium font-patrick mb-4">
              Accessories for {product?.name}
            </h2>
            {products && (
              <div className="hidden md:block">
                <Carousel
                  itemsPerSlide={3}
                  productList={products.filter(
                    (product: Product) => product.accessory === true
                  )}
                />
              </div>
            )}
            {products && (
              <div className="block md:hidden">
                <Carousel
                  itemsPerSlide={1}
                  productList={products.filter(
                    (product: Product) => product.accessory === true
                  )}
                />
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-4xl font-medium font-patrick mb-4">
              Pal who can use {product?.name}
            </h2>
            {products && (
              <div className="hidden md:block">
                <Carousel
                  itemsPerSlide={3}
                  productList={products.filter(
                    (product: Product) => product.accessory === false
                  )}
                />
              </div>
            )}
            {products && (
              <div className="block md:hidden">
                <Carousel
                  itemsPerSlide={1}
                  productList={products.filter(
                    (product: Product) => product.accessory === false
                  )}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SingleProduct;
