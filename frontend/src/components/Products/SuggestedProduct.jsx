import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";
import axios from "axios";
import { server } from "../../server";

const TOP_N = 10;
const SuggestedProduct = ({ item_name, currentProduct }) => {
  const [data, setData] = useState(null);

  console.log(item_name, "item name");
  console.log(currentProduct, "current product");

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.post(`${server}/product/get-related-products`, {
        item_name: item_name ?? currentProduct?.name,
        top_n: TOP_N,
      });
      console.log(res, "data");
      setData(res.data.products);
    };
    fetchProducts();
  }, [item_name, currentProduct]);

  return (
    <div>
      {data ? (
        <div className={`p-4 ${styles.section}`}>
          <h2
            className={`${styles.heading} text-[25px] font-[500] border-b mb-5`}>
            Related Product
          </h2>
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
            {data &&
              data?.map((i, index) => <ProductCard data={i} key={index} />)}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SuggestedProduct;
