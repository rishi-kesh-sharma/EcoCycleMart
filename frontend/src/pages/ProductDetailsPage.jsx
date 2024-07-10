import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import ProductDetails from "../components/Products/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../server";

const ProductDetailsPage = () => {
  const { allProducts } = useSelector((state) => state.products);
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    // const data = allProducts && allProducts.find((i) => i._id === id);
    // setData(data);
    const getSingleProduct = async () => {
      const response = await axios.get(
        `${server}/product/get-single-product/${id}`
      );

      console.log(response, "response product");

      console.log(response.data, "product data");
      setData(response.data.product);
    };
    getSingleProduct();
  }, [allProducts, id]);

  return (
    <div>
      <Header />
      <ProductDetails data={data} />
      <SuggestedProduct item_name={data?.name} currentProduct={data} />
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
