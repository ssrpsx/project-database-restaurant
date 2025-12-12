import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useParams } from 'react-router-dom';

const SearchBar: React.FC = () => {
    const [keyword, setKeyword] = useState(""); 
    const navigate = useNavigate();
    const { table_number } = useParams();

    const handleSearch = () => {
        if (!keyword.trim()) return;
        navigate(`/${table_number}/search?keyword=${encodeURIComponent(keyword)}`);
    };

    return (
        <div className="container mx-auto text-center relative px-2">
            <input
                type="text"
                placeholder="ค้นหารายการอาหาร"
                className="border-2 border-gray-800 rounded text-gray-800 px-3 py-2 w-full"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />

            <button
                onClick={handleSearch}
                className="absolute top-[50%] right-3.5 -translate-y-1/2 p-3 rounded hover:bg-gray-200 transition cursor-pointer"
            >
                <FaSearch className="text-gray-800" />
            </button>
        </div>
    );
};

export default SearchBar;
