"use client";

import React, { useEffect, useState } from "react";
import { FaFileInvoiceDollar } from "react-icons/fa";
import {
  depositTableColumns,
  depositTableRows,
} from "@/components/table/depositsData";
import {
  withdrawTableColumns,
  withdrawTableRows,
} from "@/components/table/withdrawData";
import DataTableSection from "@/components/table/DataTableSection";
import axios from "axios";
import { Input } from "@/components/ui";
import toast from "react-hot-toast";
import { apiService } from "@/lib/api";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState(0);
  const [remark, setRemark] = useState("");
  const [errors, setErrors] = useState({ amount: "", remark: "" });
  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    try {
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      if (token) {
        const response = await apiService.get("/user/profile");
        if (response.success) {
          const parsedUser = response.data;
          localStorage.setItem("user", JSON.stringify(parsedUser));
          setUser(parsedUser);
        }
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch profile");
      console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleTopUp = async () => {
    const newErrors = {};
    if (!amount) newErrors.amount = "Amount is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(
        "https://api.tripbng.com/payment/paymentinti",
        {
          amount: Number(amount),
          type: "userwallet",
          firstname: user?.firstname || "User",
          lastname: user?.lastname || "Name",
          email: user?.email || "user@example.com",
          phone: user?.phone || "0000000000",
        }
      );

      const html = response.data;
      const newWindow = window.open();
      newWindow.document.write(html);
      newWindow.document.close();

      // Refresh profile after payment (assuming payment was successful)
      setTimeout(getProfile, 5000); // Wait 5 seconds before refreshing
    } catch (error) {
      console.error("Error making payment:", error.message);
      toast.error("Payment failed: " + (error.message || "Unknown error"));
    }
  };

  const menuItems = ["My Wallet", "My Deposite", "My Withdraw"];
  
  const content = {
    "My Wallet": (
      <div className="p-4">
        <div className="flex items-center mb-6">
          <div className="flex justify-center items-center h-12 w-12 rounded-full bg-blue-100">
            <FaFileInvoiceDollar className="text-blue-600 text-3xl" />
          </div>
          <h1 className="font-semibold text-gray-800 text-2xl ml-4">
            Top-up My Wallet
          </h1>
        </div>
        <div className="flex text-m border-b">
          <h1 className="px-6 py-2 cursor-pointer text-blue-600 font-bold border-b-4 border-blue-500">
            Online
          </h1>
        </div>

        <div className="mt-6">
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="amount"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Amount(₹)*
              </label>
              <Input
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setAmount(value);
                    if (value) {
                      setErrors((prev) => ({ ...prev, amount: "" }));
                    }
                  }
                }}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="remark"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Remark
              </label>
              <Input
                placeholder="Optional"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </div>
          </div>
          <button
            className="py-2 px-5 text-white rounded-md text-m font-bold bg-blue hover:bg-blue-700 transition-colors duration-300"
            onClick={handleTopUp}
            disabled={loading}
          >
            {loading ? "Processing..." : "TOP-UP BALANCE"}
          </button>
        </div>
      </div>
    ),
    "My Deposite": (
      <DataTableSection
        title="My Deposits"
        icon={<FaFileInvoiceDollar className="text-blue-600 text-3xl" />}
        columns={depositTableColumns}
        rows={depositTableRows}
      />
    ),
    "My Withdraw": (
      <DataTableSection
        title="My Withdraw"
        icon={<FaFileInvoiceDollar className="text-blue-600 text-3xl" />}
        columns={withdrawTableColumns}
        rows={withdrawTableRows}
      />
    ),
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 mt-36">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-4">
            {/* Balance and Credit Info */}
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow rounded-md p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  My Account
                </h2>
                <div className="">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">
                      My Balance
                    </span>
                    {loading ? (
                      <div className="animate-pulse h-6 w-20 bg-gray-200 rounded"></div>
                    ) : (
                      <span className="text-blue-500 dark:text-blue-400">
                        ₹ {user?.volate || 0}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu */}
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow rounded-md">
                <nav>
                  {menuItems.map((item, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`block px-4 py-3 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${
                        selected === index
                          ? "bg-yellow/60 text-white font-semibold dark:bg-blue dark:text-gray-200"
                          : ""
                      }`}
                      onClick={() => setSelected(index)}
                    >
                      {item}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="bg-white dark:bg-gray-800 shadow rounded-md">
              {content[menuItems[selected]]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}