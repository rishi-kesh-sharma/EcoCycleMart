import React, { useEffect, useState } from "react";
import KhaltiCheckout from "khalti-checkout-web";
import styles from "../../../styles/styles";

const KHALTI_PUBLIC_KEY = "test_public_key_9b53ff42bd284ec0b03a5e6fc5de40fb";
const Khalti = ({ item, khaltiPaymentHandler }) => {
  const [isPaid, setIsPaid] = useState();

  const { discountPrice, _id, name, qty } = item;
  console.log(item, "item");
  let config = {
    publicKey: KHALTI_PUBLIC_KEY,
    productIdentity: _id,
    productName: name,
    productUrl: "http://gameofthrones.com/buy/Dragons",
    eventHandler: {
      onSuccess(payload) {
        // hit merchant api for initiating verification
        console.log(payload, "on success payload");

        if (
          localStorage.getItem("paid_items_through_khalti") &&
          Array.isArray(
            JSON.parse(localStorage.getItem("paid_items_through_khalti"))
          )
        ) {
          localStorage.setItem(
            "paid_items_through_khalti",
            JSON.stringify([
              ...JSON.parse(localStorage.getItem("paid_items_through_khalti")),
              _id,
            ])
          );
        } else {
          localStorage.setItem(
            "paid_items_through_khalti",
            JSON.stringify([_id])
          );
        }
        setIsPaid(true);
        window.location.reload();
      },
      // onError handler is optional
      onError(error) {
        // handle errors
        console.log(error, "khalti payment error");

        throw new Error(error, "khalti payment error");
      },
    },
    // one can set the order of payment options and also the payment options based on the order and items in the array
    paymentPreference: [
      "KHALTI",
      //   "MOBILE_BANKING",
      //   "EBANKING",
      //   "CONNECT_IPS",
      //   "SCT",
    ],
  };
  let checkout = new KhaltiCheckout({ ...config });

  const totalAmount = discountPrice * qty;

  useEffect(() => {
    const itemsPaidThroughKhalti = JSON.parse(
      localStorage.getItem("paid_items_through_khalti")
    );
    const isCurrentItemPaid = itemsPaidThroughKhalti?.includes(_id);
    setIsPaid(isCurrentItemPaid);
  }, [_id]);
  return (
    <div className="flex justify-between items-center w-full gap-2 py-2">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-12">
          <p className="font-semibold">Name:</p>
          <p>{item?.name.slice(0, 30)}</p>
        </div>
        <div className="flex items-center justify-between gap-12">
          <p className="font-semibold">Quantity:</p>
          <p>{item?.qty}</p>
        </div>
        <div className="flex items-center justify-between gap-12">
          <p className="font-semibold">Unit Price:</p>
          <p>{`Nrs. ${item?.discountPrice}`}</p>
        </div>
        <div className="flex items-center justify-between gap-12">
          <p className="font-semibold">Total:</p>
          <p>{`Nrs. ${totalAmount}`}</p>
        </div>
      </div>
      {isPaid ? (
        "Paid"
      ) : (
        <button
          className={`${styles.button} !bg-primary text-white !h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[400] w-[60px]`}
          onClick={() => {
            checkout.show({ amount: Number(totalAmount) * 100 });
          }}>
          Pay
        </button>
      )}
    </div>
  );
};

export default Khalti;
