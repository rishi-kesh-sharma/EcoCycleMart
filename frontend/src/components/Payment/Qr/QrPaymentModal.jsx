import * as React from "react";

import { Modal } from "@material-ui/core";
import styles from "../../../styles/styles";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: "2rem",
  background: "white",
  borderRadius: "1rem",
};

export default function QrPaymentModal({ seller, item, isPaid, setIsPaid }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { discountPrice, _id, name, qty } = item;

  const handleMarkPaid = () => {
    if (
      localStorage.getItem("paid_items_through_qr") &&
      Array.isArray(JSON.parse(localStorage.getItem("paid_items_through_qr")))
    ) {
      localStorage.setItem(
        "paid_items_through_qr",
        JSON.stringify([
          ...JSON.parse(localStorage.getItem("paid_items_through_qr")),
          _id,
        ])
      );
    } else {
      localStorage.setItem("paid_items_through_qr", JSON.stringify([_id]));
    }
    setIsPaid(true);
    window.location.reload();
  };

  const totalAmount = discountPrice * qty;

  return (
    <div>
      <button
        className={`${styles.button} !bg-primary text-white !h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[400] w-[60px]`}
        onClick={handleOpen}>
        Pay
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <div style={style}>
          {isPaid ? (
            <div>You have already made payment for this item</div>
          ) : (
            <div className="">
              <p
                id="modal-modal-title"
                variant="h6"
                component="h2"
                className="text-lg font-semibold">
                Scan the below Qr
              </p>
              <div className="flex items-center my-4 gap-4">
                <p className="text-base font-semibold">Amount:</p>
                <p>{totalAmount}</p>
              </div>
              <div>
                <img
                  src={seller.qrCode.url}
                  alt="qr-code"
                  height={200}
                  width={200}
                />
              </div>
              <button
                className={`${styles.button} mt-4 !bg-primary text-white !h-[45px] rounded-[3px] cursor-pointer text-[18px] font-[400] w-[120px]`}
                onClick={handleMarkPaid}>
                Mark Paid
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
