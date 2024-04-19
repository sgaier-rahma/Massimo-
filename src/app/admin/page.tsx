"use client";
import { useSession } from "next-auth/react";
import { RestaurantType, UserType } from "@/types/types";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const getRestaurants = async () => {
    const res = await fetch(`http://localhost:3000/api/restaurants`, {
        cache: "no-store"
    })
    if (!res.ok) {
        throw new Error("Failed!");
    }
    return res.json()
}

const getUsers = async () => {
    const res = await fetch(`http://localhost:3000/api/users`, {
        cache: "no-store"
    })
    if (!res.ok) {
        throw new Error("Failed!");
    }
    return res.json()
}

const AdminPage = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);
    const [users, setUsers] = useState<UserType[]>([]);

    const handleDeleteUser = (id: string) => {
        fetch(`http://localhost:3000/api/users/${id}`, {
            method: "DELETE",
        }).then(() => {
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        });

    }

    const handleDeleteRestaurant = (id: string) => {
        fetch(`http://localhost:3000/api/restaurants/${id}`, {
            method: "DELETE",
        }).then(() => {
            setRestaurants((prevRestaurants) => prevRestaurants.filter((restaurant) => restaurant.id !== id));
        });

    }

    const handleUpdateRestaurant = (id: string) => {
        router.push(`/admin/editRestaurant/${id}`);
    }
    useEffect(() => {
        getRestaurants().then((data) => {
            setRestaurants(data);
        });
        getUsers().then((data) => {
            setUsers(data);
        });
    }, []);

    return (
        <div className="p-4 lg:px-20 xl:px-40  shadow-md  items-center justify-center text-red-500">
            <h1 className="text-4xl font-bold w-full text-center p-8">Admin Page</h1>
            <div className="grid grid-cols-2 gap-x-8 h-5/6">
                <div >
                    <h1 className="font-bold text-2xl text-center"> Users </h1>
                    <ul role="list" className="divide-y divide-gray-100 overflow-y-scroll scroll-smooth h-[600px] p-2">
                        {users.map((user) => (
                            <li key={user.id} className="flex justify-between gap-x-6 py-5">
                                <div className="flex min-w-0 gap-x-4">
                                    <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={user.image} alt="user image" />
                                    <div className="min-w-0 flex-auto">
                                        <p className="text-sm font-semibold leading-6 text-gray-900">{user.name}</p>
                                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="sm:flex sm:flex-row sm:items-end">
                                    <button type="button"
                                        className="bg-red-400 text-white hover:text-red-700 p-2 rounded-sm "
                                        onClick={() => handleDeleteUser(user.id)}>
                                        Delete
                                    </button>

                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h1 className="font-bold text-2xl text-center"> Restaurants </h1>
                    <ul role="list" className="divide-y divide-gray-100 overflow-y-scroll h-[600px] p-2">

                        {restaurants.map((restaurant) => (
                            <li key={restaurant.id} className="flex justify-between gap-x-6 py-5">
                                <div className="flex min-w-0 gap-x-4">
                                    <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={restaurant.img} alt="restaurant image" />
                                    <div className="min-w-0 flex-auto">
                                        <p className="text-sm font-semibold leading-6 text-gray-900">{restaurant.title}</p>
                                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">{restaurant.desc}</p>
                                    </div>
                                </div>
                                <div className="sm:flex sm:flex-row sm:items-end">
                                    <button type="button"
                                        className="bg-red-400 text-white hover:text-red-700 p-2 rounded-sm "
                                        onClick={() => handleDeleteRestaurant(restaurant.id)}>
                                        Delete
                                    </button>
                                    <button
                                        type="button"
                                        className="bg-green-400 text-white hover:text-green-700 p-2 rounded-sm ml-1 "
                                        onClick={() => handleUpdateRestaurant(restaurant.id)}>
                                        Edit
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <Link href="/admin/addRestaurant">
                <button type="button" className="bg-green-400 text-white hover:text-green-700 p-2 rounded-sm w-full font-bold text-2xl mt-2">Add Restaurant</button>
            </Link>
        </div>
    )
}

export default AdminPage;