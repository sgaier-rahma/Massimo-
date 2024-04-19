"use client";

import { useSession } from "next-auth/react";
import { RestaurantType, MenuType } from "@/types/types";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { ImageUpload } from "../../components/uploadbtn"

type Inputs = {
  title: string;
  desc: string;
  color: string;
  slug: string;
  restSlug: string;
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

const AddCategoryPage = () => {
  const { data: session, status } = useSession();
  const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);

  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    desc: "",
    color: "",
    slug: "",
    restSlug: "",
  });

  //get restaurants
  useEffect(() => {
    getRestaurants(session?.user.id).then((data) => setRestaurants(data));
  }, [session]);


  const [imageUrl, setImageUrl] = useState("");

  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated" || !session?.user.type === "owner") {
    router.push("/");
  }

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value.trim() };
    });
  };


  const handleImageChange = (newImageUrl: string) => {
    setImageUrl(newImageUrl);
  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/categories", {
        method: "POST",
        body: JSON.stringify({
          img: imageUrl,
          ...inputs,
        }),
      });

      const data = await res.json();

      router.push(`/`);
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
          <label className="text-sm">Slug</label>
          <input
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            placeholder="Slug"
            name="slug"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">Color</label>
          <select
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            onChange={handleSelect}
            name="color"
          >
            <option value="gray-400">
              --Select Color--
            </option>
            <option value="red-400">Red</option>
            <option value="green-400">Green</option>
            <option value="yellow-400">Yellow</option>
            <option value="orange-400">orange</option>
          </select>
        </div>


        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">Restaurant</label>
          <select
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            onChange={handleSelect}
            name="restSlug"
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

export default AddCategoryPage;
