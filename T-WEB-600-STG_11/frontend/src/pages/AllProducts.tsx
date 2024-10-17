import { FC, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Product, fetchAllProducts } from "../api/product/productAPI";
import ProductCard from "../components/ProductCard";

const AllProducts: FC = () => {
  const [productList, setProductList] = useState<Product[]>([]);

  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[]>("products", fetchAllProducts);

  useEffect(() => {
    if (products) {
      setProductList(
        products.filter((product: Product) => product.accessory === false)
      );
    }
  }, [products]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto bg-brown-02 min-h-screen  p-5 w-full">
      <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {productList.map((product) => (
          <ProductCard
            key={product.id}
            productType={product.name}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
