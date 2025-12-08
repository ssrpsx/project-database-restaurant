import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar: React.FC = () => {
    return (
        <div className="container mx-auto mt-6 text-center px-7.5 relative">
            <input
                type="text"
                placeholder="ค้นหารายการอาหาร"
                className="border-2 border-[#181818] rounded text-gray-800 px-3 py-2 w-full"
            />

            <button
                className="absolute top-[50%] right-8 -translate-y-1/2 p-3 rounded hover:bg-gray-200 transition cursor-pointer"
            >
                <FaSearch className="text-gray-800" />
            </button>
        </div>
    )
}

export default SearchBar;