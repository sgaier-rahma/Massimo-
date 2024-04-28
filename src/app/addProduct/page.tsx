"use client";

import { useSession } from "next-auth/react";
import { RestaurantType, MenuType } from "@/types/types";
import axios from "axios";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { ImageUpload } from "../../components/uploadbtn"


type Inputs = {
  title: string;
  desc: string;
  price: number;
  catSlug: string;
};

type Option = {
  title: string;
  additionalPrice: number;
};

const getRestaurants = async (userId: string) => {
  const res = await fetch(`http://localhost:3000/api/owner/${userId}/restaurant`, {
    cache: "no-store"
  })

  if (!res.ok) {
    throw new Error("Failed!");

  }

  return res.json()
}

const getCategories = async (restaurant: string) => {
  console.log(restaurant);
  const res = await fetch(`http://localhost:3000/api/categories?cat=${restaurant}`)
  if (!res.ok) {
    throw new Error("Failed!");

  }

  return res.json()
};

const AddPage = () => {
  const { data: session, status } = useSession();
  const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);
  const [restaurant, setRestaurant] = useState<RestaurantType[]>([]);
  const [categories, setCategories] = useState<MenuType[]>([]);
  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    desc: "",
    price: 0,
    catSlug: "",
  });


  //get restaurants
  useEffect(() => {
    getRestaurants(session?.user.id).then((data) => {
      setRestaurants(data)
    });
  }, [session]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!restaurant) return;
      try {
        const data = await getCategories(restaurant["slug"]);

        setCategories(data); // Log the updated categories data here
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [restaurant]);


  const [option, setOption] = useState<Option>({
    title: "",
    additionalPrice: 0,
  });

  const [options, setOptions] = useState<Option[]>([]);
  const [imageUrl, setImageUrl] = useState("");

  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // if (status === "unauthenticated" || !session?.user.isAdmin) {
  //   router.push("/");
  // }

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const changeOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOption((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleImageChange = (newImageUrl: string) => {
    setImageUrl(newImageUrl);
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        body: JSON.stringify({
          img: imageUrl,
          ...inputs,
          options,
        }),
      });

      const data = await res.json();

      router.push(`/product/${data.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 lg:px-20 xl:px-40 flex items-center justify-center text-red-500">
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-6">
        <h1 className="text-4xl mb-2 text-gray-300 font-bold">
          Add New Product
        </h1>
        <ImageUpload value={imageUrl} onChange={handleImageChange} />

        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">Title</label>
          <input
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            type="text"
            placeholder="Bella Napoli"
            name="title"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm">Description</label>
          <textarea
            rows={3}
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            placeholder="A timeless favorite with a twist, showcasing a thin crust topped with sweet tomatoes, fresh basil and creamy mozzarella."
            name="desc"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">Price</label>
          <input
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            type="number"
            placeholder="29"
            name="price"
            onChange={handleChange}
          />
        </div>
        {/*  */}
        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">Restaurants</label>
          <select
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            onChange={(e) => {
              setRestaurant(restaurants.find((rest) => rest["slug"] == e.target.value)!);
            }}
          >
            <option value="none">
              --Select Restaurant--
            </option>
            {restaurants.map((restaurant) => (
              <option key={restaurant["slug"]} value={restaurant["slug"]}>
                {restaurant["title"]}
              </option>
            ))}

          </select>
        </div>
        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">Category</label>
          <select
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            onChange={handleSelect}
            name="catSlug"
          >
            <option value="none">
              --Select Category--
            </option>
            {categories.map((category) => (
              <option key={category["slug"]} value={category["slug"]}>
                {category["title"]}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm">Options</label>
          <div className="flex">
            <input
              className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
              type="text"
              placeholder="Title"
              name="title"
              onChange={changeOption}
            />
            <input
              className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
              type="number"
              placeholder="Additional Price"
              name="additionalPrice"
              onChange={changeOption}
            />
            <button
              className="bg-gray-500 p-2 text-white"
              onClick={(e) => {
                e.preventDefault();
                setOptions((prev) => [...prev, option])}
              }
            >
              Add Option
            </button>
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            {options.map((opt) => (
              <div
                key={opt.title}
                className="p-2  rounded-md cursor-pointer bg-gray-200 text-gray-400"
                onClick={(e) => {
                 
                  setOptions((prev) =>
                    prev.filter((item) => item.title !== opt.title)
                  )
                }}
              >
                <span>{opt.title}</span>
                <span className="text-xs"> (+ ${opt.additionalPrice})</span>
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="bg-red-500 p-4 text-white w-48 rounded-md relative h-14 flex items-center justify-center"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddPage;
