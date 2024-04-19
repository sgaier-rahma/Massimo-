"use client";

import { useSession } from "next-auth/react";
import { UserType } from "@/types/types";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { ImageUpload } from "@/components/uploadbtn"
import CoordinatesSelector from "@/components/CoordinatesSelector";
type Inputs = {
  title: string;
  desc: string;
  ownerID: string;
  slug: string;
  color: string;
  town: string;
  address: string;
  postalCode: string;
  openingTime: string;
  closingTime: string;
};

const getUsers = async () => {
  const res = await fetch(`http://localhost:3000/api/users`, {
    cache: "no-store"
  })
  if (!res.ok) {
    throw new Error("Failed!");
  }
  return res.json()
}


const AddRestaurantPage = () => {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedCoordinates, setSelectedCoordinates] = useState([0,0]);
  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    desc: "",
    ownerID: "",
    slug: "",
    color: "",
    town: "",
    address: "",
    postalCode: "",
    openingTime: "",
    closingTime: "",
  });


  const handleCoordinateSelection = (coords) => {
    setSelectedCoordinates([coords.latLng.lat(), coords.latLng.lng()]);
  };
  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data);
    });

  }, []);

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
      return { ...prev, [e.target.name]: e.target.value.trim() };
    });
  };


  const handleImageChange = (newImageUrl: string) => {
    setImageUrl(newImageUrl);
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/restaurants", {
        method: "POST",
        body: JSON.stringify({
          img: imageUrl,
          ...inputs,
          lat: selectedCoordinates ? selectedCoordinates[0] : "",
          lng: selectedCoordinates ? selectedCoordinates[1] : "",
        }),
      });

      const data = await res.json();

      router.push(`/admin`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 lg:px-20 xl:px-40  flex items-center justify-center text-red-500">
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
            placeholder="Title"
            name="title"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm">Description</label>
          <textarea
            rows={3}
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            placeholder="Description"
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
          <label className="text-sm">Opening Time</label>
          <input
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            placeholder="Opening Time"
            type="time"
            name="openingTime"
            onChange={handleChange}
          />
        </div>

        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">Closing Time</label>
          <input
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            placeholder="Closing Time"
            type="time"
            name="closingTime"
            onChange={handleChange}
          />
        </div>

        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">Town</label>
          <input
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            placeholder="Town"
            name="town"
            onChange={handleChange}
          />
        </div>

        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">Address</label>
          <input
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            placeholder="Address"
            name="address"
            onChange={handleChange}
          />
        </div>

        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">Postal Code</label>
          <input
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            placeholder="Postal Code"
            name="postalCode"
            onChange={handleChange}
          />
        </div>
        <CoordinatesSelector onCoordinatesSelect={handleCoordinateSelection} />


        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">Owner</label>
          <select
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            onChange={handleSelect}
            name="ownerID"
          >
            <option value="none">
              --Select Owner--
            </option>
            {users.map((user) => (
              <option className="" key={user.id} value={user.id}>
                <text>{user.name}</text>
              </option>
            ))}
          </select>
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

        <button
          type="submit"
          className="bg-red-500 p-4 text-white w-48 rounded-md relative h-14 flex items-center justify-center"
        >
          Submit
        </button>
      </form >
    </div >
  
  );
};

export default AddRestaurantPage;
