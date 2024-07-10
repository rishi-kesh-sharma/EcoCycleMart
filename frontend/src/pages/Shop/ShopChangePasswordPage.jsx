import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import ShopChangePassword from "../../components/Shop/ChangePassword";

const ShopChangePasswordPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full mt-[2rem]">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={4} />
        </div>
        <div className="w-full justify-center flex ml-[2rem]">
          <ShopChangePassword />
        </div>
      </div>
    </div>
  );
};

export default ShopChangePasswordPage;
