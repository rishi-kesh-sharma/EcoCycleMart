import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import { useEffect } from "react";

import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import Khalti from "./Khalti/Khalti";

import { v4 as uuidv4 } from "uuid";
// qr code image
import QrCodeImage from "../../Assests/sandeep_qr.jpeg";
import QrPayment from "./Qr/Qr";

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(orderData);
  }, []);

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: "Sunflower",
            amount: {
              currency_code: "NRS",
              value: orderData?.totalPrice,
            },
          },
        ],
        // not needed if a shipping address is actually needed
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
      })
      .then((orderID) => {
        return orderID;
      });
  };

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    order.paymentInfo = {
      type: "Cash On Delivery",
      id: uuidv4(),
    };

    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate("/order/success");
        toast.success("Order successful!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      });
  };

  const khaltiPaymentHandler = async () => {
    // e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    order.paymentInfo = {
      id: uuidv4(),
      type: "Khalti",
      status: "Paid",
    };
    order.paidAt = new Date(Date.now());
    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate("/order/success");
        toast.success("Order successful!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      });

    // remove the paid items array from localstorage
    localStorage.removeItem("paid_items_through_khalti");
  };
  const QrPaymentHandler = async () => {
    // e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    order.paymentInfo = {
      id: uuidv4(),
      type: "Qr",
      status: "Paid",
    };
    order.paidAt = new Date(Date.now());
    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate("/order/success");
        toast.success("Order successful!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      });

    // remove the paid items array from localstorage
    localStorage.removeItem("paid_items_through_khalti");
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <PaymentInfo
            user={user}
            open={open}
            setOpen={setOpen}
            createOrder={createOrder}
            cashOnDeliveryHandler={cashOnDeliveryHandler}
            orderData={orderData}
            khaltiPaymentHandler={khaltiPaymentHandler}
            QrPaymentHandler={QrPaymentHandler}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({
  open,
  setOpen,
  cashOnDeliveryHandler,
  orderData,
  khaltiPaymentHandler,
  QrPaymentHandler,
}) => {
  const [select, setSelect] = useState(1);

  const seller = {
    qrCode: {
      url: QrCodeImage,
    },
  };

  console.log(localStorage.getItem("paid_items_through_khalti"), "items");

  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
      {/* select buttons */}
      <div>
        <div className="flex w-full pb-5 border-b mb-2">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
            onClick={() => setSelect(1)}>
            {select === 1 ? (
              <div className="w-[13px] h-[13px] bg-black rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[500] text-[#000000b1]">
            Pay With QR
          </h4>
        </div>
        {/* pay with qr */}

        {/* TODO: problem is user does not only buy one product at checkout . The products may belong to multiple vendors but can include the qr of the admins */}
        {select === 1 ? (
          <div className="">
            {orderData?.cart?.map((cartItem, index) => {
              return (
                <div className="w-full flex border-b" key={index}>
                  <QrPayment item={cartItem} seller={seller} />
                </div>
              );
            })}

            {orderData?.cart?.every((cartItem) => {
              return (
                localStorage.getItem("paid_items_through_qr") &&
                Array.isArray(
                  JSON.parse(localStorage.getItem("paid_items_through_qr"))
                ) &&
                localStorage
                  .getItem("paid_items_through_qr")
                  ?.includes(cartItem._id)
              );
            }) && (
              <button
                className={`${styles.button} !bg-primary text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[400]`}
                onClick={() => {
                  QrPaymentHandler();
                }}>
                confirm
              </button>
            )}
          </div>
        ) : null}
      </div>

      <br />
      {/* khalti payment */}
      <div>
        <div className="flex w-full pb-5 border-b mb-2">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
            onClick={() => setSelect(2)}>
            {select === 2 ? (
              <div className="w-[13px] h-[13px] bg-black rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[500] text-black">
            Pay with Khalti
          </h4>
        </div>

        {/* pay with khalti */}
        {select === 2 ? (
          <div className="">
            {orderData?.cart?.map((cartItem, index) => {
              return (
                <div className="w-full flex border-b" key={index}>
                  <Khalti
                    item={cartItem}
                    khaltiPaymentHandler={khaltiPaymentHandler}
                  />
                </div>
              );
            })}

            {orderData?.cart?.every((cartItem) => {
              return (
                localStorage.getItem("paid_items_through_khalti") &&
                Array.isArray(
                  JSON.parse(localStorage.getItem("paid_items_through_khalti"))
                ) &&
                localStorage
                  .getItem("paid_items_through_khalti")
                  ?.includes(cartItem._id)
              );
            }) && (
              <button
                className={`${styles.button} !bg-primary text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[400]`}
                onClick={() => {
                  khaltiPaymentHandler();
                }}>
                confirm
              </button>
            )}
          </div>
        ) : null}
      </div>

      <br />
      {/* cash on delivery */}
      <div>
        <div className="flex w-full pb-5 border-b mb-2">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
            onClick={() => setSelect(3)}>
            {select === 3 ? (
              <div className="w-[13px] h-[13px] bg-black rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[500] text-[#000000b1]">
            Cash on Delivery
          </h4>
        </div>

        {/* cash on delivery */}
        {select === 3 ? (
          <div className="w-full flex">
            <form className="w-full" onSubmit={cashOnDeliveryHandler}>
              <input
                type="submit"
                value="Confirm"
                className={`${styles.button} !bg-primary text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
              />
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  const shipping = orderData?.shipping?.toFixed(2);
  // const shipping = 0;
  return (
    <div className="w-full bg-white rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">subtotal:</h3>
        <h5 className="text-[18px] font-[600]">
          Nrs. {orderData?.subTotalPrice}
        </h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">shipping:</h3>
        <h5 className="text-[18px] font-[600]">Nrs. {shipping}</h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
        <h5 className="text-[18px] font-[600]">
          {orderData?.discountPrice ? "Nrs." + orderData.discountPrice : "-"}
        </h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">
        Nrs.{orderData?.totalPrice}
      </h5>
      <br />
    </div>
  );
};

export default Payment;
