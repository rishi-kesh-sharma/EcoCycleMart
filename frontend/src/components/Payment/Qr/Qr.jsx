import React, { useEffect, useState } from "react";
import QrPaymentModal from "./QrPaymentModal";

const QrPayment = ({ item, seller }) => {
  const [isPaid, setIsPaid] = useState();

  const { discountPrice, _id, qty } = item;

  const totalAmount = discountPrice * qty;

  useEffect(() => {
    const itemsPaidThroughKhalti = JSON.parse(
      localStorage.getItem("paid_items_through_qr")
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
        <QrPaymentModal
          seller={seller}
          item={item}
          setIsPaid={setIsPaid}
          isPaid={isPaid}
        />
      )}
    </div>
  );
};

export default QrPayment;
