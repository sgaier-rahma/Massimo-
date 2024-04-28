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
      <div className="grid grid-cols-2 p-8 gap-2 items-baseline">
        {restaurants.map((restaurant) => (
          <Link
            href={`/restaurants/${restaurant.slug}/menu`}
            key={restaurant.id}
            className=" bg-cover h-80 grid grid-rows-3 p-8"
            style={{
              backgroundImage: `url(${restaurant.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"
            }}
          >
            <h1 className="uppercase font-bold text-4xl text-amber-600">{restaurant.title}</h1>
            <p className="text-sm my-6 font-bold line-clamp-2 w-1/2">{restaurant.desc}</p>
            <button className={`hidden 2xl:block  bg-${restaurant.color} text-${restaurant.color === "black" ? "white" : "black"} py-2 px-4 rounded-md self-start w-32`}>Explore</button>
          </Link>
        ))
        }
      </div >
    </div>
  );
};

export default Restaurants;
