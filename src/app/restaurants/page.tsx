import { RestaurantType } from "@/types/types";
import Link from "next/link";
import React from "react";

const getData = async () => {
  const res = await fetch("http://localhost:3000/api/restaurants", {
    cache: "no-store"
  })

  if (!res.ok) {
    throw new Error("Failed!");

  }

  return res.json()
}

const Restaurants = async () => {

  const restaurants: RestaurantType[] = await getData()
  return (
    <div>
      <h1 className='text-center text-red-600 font-black text-6xl p-4'>Restaurants</h1>
      <div className="p-4 lg:px-20 xl:px-40 flex gap-2 flex-col md:flex-row items-center">

        {restaurants.map((restaurant) => (
          <Link
            href={`/restaurants/${restaurant.slug}/menu`}
            key={restaurant.id}
            className="w-full h-1/3 bg-cover p-8 md:h-1/2"
            style={{
              backgroundImage: `url(${restaurant.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"
            }}
          >
            <div className={`text-white w-1/2`}>
              <h1 className="uppercase font-bold text-3xl text-white">{restaurant.title}</h1>
              <p className="text-sm my-8 font-bold text-white">{restaurant.desc}</p>
              <button className={`hidden 2xl:block  bg-${restaurant.color} text-${restaurant.color === "black" ? "white" : "black"} py-2 px-4 rounded-md`}>Explore</button>
            </div>
          </Link>
        ))
        }
      </div >
    </div>
  );
};

export default Restaurants;
