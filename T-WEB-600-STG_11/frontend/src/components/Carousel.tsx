import React, { FC } from "react";
import Slider from "react-slick";
import ProductCard from "./ProductCard";
import { Product } from "../api/product/productAPI";

interface CarouselProps {
  itemsPerSlide: number;
  productList: Product[];
}

const Carousel: FC<CarouselProps> = (props) => {
  const { itemsPerSlide, productList } = props;

  function SamplePrevArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", left: "20px", zIndex: 1 }}
        onClick={onClick}
      />
    );
  }

  function SampleNextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", right: "30px" }}
        onClick={onClick}
      />
    );
  }

  const settings = {
    infinite: true,
    speed: 500,
    rows: 1,
    slidesToShow: itemsPerSlide,
    slidesToScroll: itemsPerSlide,
    autoplaySpeed: 3000,
    autoplay: true,
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />,
  };

  return (
    <React.Fragment>
      {productList?.length < 2 ? (
        <div className="font-bold">
          <div>No products available...</div>
        </div>
      ) : (
        <Slider {...settings}>
          {productList.map((product) => (
            <ProductCard
              key={product.id}
              productType={product.name}
              product={product}
            />
          ))}
        </Slider>
      )}
    </React.Fragment>
  );
};

export default Carousel;
