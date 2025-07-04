'use client'
import { useEffect, useState } from "react";
import { getNewProducts } from "../services/productServices";
import style from "../style/newProducts.module.css"
import Image from "next/image";
import { ProductResponseDto } from "../types/productResponse.dto";
import React from "react";
import Slider from 'react-slick';
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Import slick carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SampleNextArrow(props: any) {
  const { className, onClick } = props;
  return (
    <div className={`${className} ${style.arrow} ${style.next}`} onClick={onClick}>
      <FaChevronRight className={style.icon} />
    </div>
  );
}

function SamplePrevArrow(props: any) {
  const { className, onClick } = props;
  return (
    <div className={`${className} ${style.arrow} ${style.prev}`} onClick={onClick}>
      <FaChevronLeft className={style.icon} />
    </div>
  );
}

export default function NewProducts(){
    const [products, setProducts] = useState<ProductResponseDto[]>([]);
    const router = useRouter();

    const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: true,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
        arrows: true,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
        arrows: true,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        arrows: true,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        arrows: false,
        dots: true,
      },
    },
  ],
};
    
    useEffect(() => {
        const fetchProduct = async () => {
            const productsFetched = await getNewProducts();
            setProducts(productsFetched);
        }
        fetchProduct();
    }, []);

    return(
        <div className={style.container}>
            <div className={style.titleContainer}> 
                <h2>Nouveautés</h2>
                <h4>Découvrez nos derniers produits</h4>
            </div>

            <div className={style.sliderWrapper}>
                <Slider {...settings}>
                    {products.map((product) => (
                        <div key={product.id}>
                            <div className={style.productCard} onClick={() => router.push("/productPage/" + product.id)}>
                                <div className={style.imageWrapper}>
                                    <Image
                                        src={product.imgPath || "/placeholder.png"}
                                        alt={product.nom}
                                        fill
                                        className={style.productImage}
                                    />
                                </div>
                                <h3 className={style.productName}>{product.nom}</h3>
                                <p className={style.productPrice}>{product.prix} €</p>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}
