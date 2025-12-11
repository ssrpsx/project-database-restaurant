import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "./searchBar";
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

interface dataMenuItem {
    ID: number;
    NAME: string;
    CATEGORY_ID: number;
    PRICE: number;
    IMAGE_URL: string;
}

const SearchPage: React.FC = () => {
    const [results, setResults] = useState<dataMenuItem[]>([]);
    const location = useLocation();
    
    const params = new URLSearchParams(location.search);
    
    const { table_number } = useParams();
    const keyword = params.get("keyword") || "";

    useEffect(() => {
        const fetchData = async () => {
            if (!keyword.trim()) return;

            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings/search?keyword=${encodeURIComponent(keyword)}`);
                const data = await res.json();

                setResults(data);
            }
            catch (error) {
                console.error("❌ fetch failed:", error);
            }
        };

        fetchData();
    }, [keyword]);

    useEffect(() => {
        console.log(results);
    }, [results])

    return (
        <div className="container mx-auto max-w-5xl p-6 mt-16">

            <div className="flex items-center justify-between mb-6">
                <SearchBar />
                <a
                    href="/"
                    className="ml-1 px-4 py-2 bg-gray-800 text-white rounded-sm hover:bg-gray-700 transition"
                >
                    กลับ
                </a>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                ผลการค้นหา: <span className="text-yellow-600">{keyword}</span>
            </h1>

            {results.length === 0 && (
                <p className="text-center text-gray-500 text-lg mt-10">
                    ไม่พบรายการอาหาร
                </p>
            )}

            {/* Layout แบบหน้า Menu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {results.map(item => (
                    <Link key={item.ID} to={`/${table_number}/menu/${item.ID}`}>
                        <div className="bg-white border rounded-xl shadow-sm overflow-hidden 
                                hover:shadow-md hover:scale-[1.01] transition">
                            <img
                                src={item.IMAGE_URL}
                                alt={item.NAME}
                                className="w-full object-cover"
                            />

                            <div className="p-4">
                                <h2 className="font-semibold text-gray-800 text-lg">
                                    {item.NAME}
                                </h2>
                                <p className="text-gray-600 text-sm mt-1">
                                    {item.PRICE} บาท
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>

    );
};

export default SearchPage;
