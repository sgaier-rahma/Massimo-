"use client";
import { useCartStore } from "@/utils/store";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CartPage = () => {
  const { products, totalItems, totalPrice, removeFromCart } = useCartStore();
  const { data: session } = useSession();
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [orderType, setOrderType] = useState("Delivery");
  const [pickupTime, setPickupTime] = useState("00:00");
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const router = useRouter();

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  const handleCheckout = async () => {
    if (!session) {
      router.push("/login");
    } else {
      try {
        // Get the current date
        const currentDate = new Date();

        // Combine the date and time to create a DateTime object
        const pickupDateTime = new Date(
          `${currentDate.toISOString().split("T")[0]}T${pickupTime}`
        );
        const res = await fetch("http://localhost:3000/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            price: totalPrice,
            products,
            status: "Not Paid!",
            userEmail: session.user.email,
            paymentMethod: paymentMethod,
            orderType: orderType,
            pickupTime: pickupDateTime.toISOString(),
            phoneNumber: phoneNumber,
            address: address
          }),
        });
        const data = await res.json()
        if (orderType === "Delivery" && paymentMethod === "Online Payment") {
          router.push(`/pay/${data.id}`)
          return
        }
        router.push(`/orders`)
        products.forEach((product) => removeFromCart(product));
        return

      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col text-red-500 lg:flex-row">
      {/* PRODUCTS CONTAINER */}
      <div className="h-1/2 p-4 flex flex-col justify-center overflow-scroll lg:h-full lg:w-2/3 2xl:w-1/2 lg:px-20 xl:px-40">
        {/* SINGLE ITEM */}
        {products.map((item) => (
          <div className="flex items-center justify-between mb-4" key={item.id}>
            {item.img && (
              <Image src={item.img} alt="" width={100} height={100} />
            )}
            <div className="">
              <h1 className="uppercase text-xl font-bold">
                {item.title} x{item.quantity}
              </h1>
              <span>{item.optionTitle}</span>
            </div>
            <h2 className="font-bold">{item.price}TND</h2>
            <span
              className="cursor-pointer"
              onClick={() => removeFromCart(item)}
            >
              X
            </span>
          </div>
        ))}
      </div>
      {/* PAYMENT CONTAINER */}
      <div className="h-1/2 p-4 bg-fuchsia-50 flex flex-col gap-4 justify-center lg:h-full lg:w-1/3 2xl:w-1/2 lg:px-20 xl:px-40 2xl:text-xl 2xl:gap-6">
        <div className="flex justify-between">
          <span className="">Subtotal ({totalItems} items)</span>
          <span className="">{totalPrice}TND</span>
        </div>
        <div className="flex justify-between">
          <span className="">Service Cost</span>
          <span className="">0.00TND</span>
        </div>
        <div className="flex justify-between">
          <span className="">Delivery Cost</span>
          <span className="text-green-500">FREE!</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between">
          <span className="">TOTAL(INCL. VAT)</span>
          <span className="font-bold">{totalPrice}TND</span>
        </div>
        <span className="font-bold ">Order Type:</span>
        <select
          name="paymentMethod"
          onChange={(e) => setOrderType(e.target.value)}
          className="p-2 rounded-md border border-red-500 w-full"
        >
          <option value="Delivery">Delivery</option>
          <option value="Pickup">Pickup</option>
        </select>
        {orderType === "Delivery" && (
          <div className="flex flex-col gap-2">
            <label>Payment Method</label>
            <select
              name="paymentMethod"
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="p-2 rounded-md border border-red-500"
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Online Payment">Online Payment</option>
            </select>
          </div>
        )}
        {orderType === "Delivery" && paymentMethod ==="Cash on Delivery"&& (
          <div className="flex flex-col gap-2">
            <label>Address</label>
            <input
              type="text"
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              className="p-2 rounded-md border border-red-500"
            />
          </div>
        )}
        {orderType === "Pickup" && (
          <div className="flex flex-col gap-2">
            <label>Pickup Time</label>
            <input
              type="time"
              onChange={(e) => setPickupTime(e.target.value)}
              className="p-2 rounded-md border border-red-500"
            />
          </div>
        )}
        {orderType === "Pickup" && (
          <div className="flex flex-col gap-2">
            <label>Phone number</label>
            <input
              type="text"
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="p-2 rounded-md border border-red-500"
            />
          </div>
        )}

        <button
          className="bg-red-500 text-white p-3 rounded-md w-1/2 self-end"
          onClick={handleCheckout}
        >
          CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default CartPage;
