
import Image from "next/image";
import Link from "next/link";
import React from "react";

const addProduct = () => {

  return (
    <Link href="/addProduct" >
      <div className="flex items-center gap-4"> 
        <button className="p-1 bg-red-500 text-white rounded-md">Add product</button>
      </div>
    </Link>
  );
};

export default addProduct;
