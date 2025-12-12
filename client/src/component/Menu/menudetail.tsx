import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface dataMenuItem {
  ID: number;
  NAME: string;
  CATEGORY_ID: number;
  DESCRIPTION: string;
  PRICE: number;
  IMAGE_URL: string;
}

const MenuDetail: React.FC = () => {
  const { id } = useParams();
  const [menu, setMenu] = useState<dataMenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { table_number } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings/get_menus_detail/${id}`);

        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();
        if (Array.isArray(data)) {
          setMenu(data[0]);
        }
        else {
          setMenu(data);
        }
      }
      catch (error) {
        console.error("Error:", error);
      }
      finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => setQuantity(prev => Math.max(prev - 1, 1));

  const fullImageURL = menu?.IMAGE_URL
    ? `${menu?.IMAGE_URL}`
    : "image.png";

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!menu) return <div className="p-10 text-center">ไม่พบเมนูอาหาร</div>;

  const total = menu.PRICE * quantity;

  const price = menu.PRICE

  const handleOrder = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings/post_order/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table_number, id, quantity, price })
      });

      if (!res.ok) throw new Error("Add Order failed");

      const data = await res.json();

      alert(data.message);
      window.location.href = `/${table_number}/`
    }
    catch (error) {
      console.error("Error adding Order:", error);

      alert("ส่งออเดอร์ไปที่ครัวไม่สำเร็จ");
      window.location.href = `/${table_number}/`
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 container mx-auto pt-18">
      <div className="flex flex-col gap-4">
        <div className="w-full lg:m-auto lg:my-4 overflow-hidden rounded-lg aspect-square lg:aspect-auto lg:h-[400px]">
          <img
            src={fullImageURL}
            alt={menu.NAME}
            className="w-full h-full object-cover lg:w-auto lg:h-full lg:m-auto"
          />
        </div>

        <div className="flex justify-between items-center mt-2">
          <h2 className="text-gray-800 text-2xl font-semibold">{menu.NAME}</h2>
          <p className="text-xl font-bold text-gray-800">{menu.PRICE} บาท</p>
        </div>
        {menu.DESCRIPTION && <p className="text-gray-500 text-sm">{menu.DESCRIPTION}</p>}
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 w-[200px]">
            <button
              className="bg-gray-200 text-gray-800 px-3 py-1 w-10 h-10 rounded hover:bg-red-600"
              onClick={handleDecrease}
            >
              -
            </button>
            <span className="w-11 text-center text-gray-800 text-lg">{quantity}</span>
            <button
              className="bg-gray-200 text-gray-800 px-3 py-1 w-10 h-10 rounded hover:bg-red-600"
              onClick={handleIncrease}
            >
              +
            </button>
          </div>

          <span className="text-gray-800 text-lg font-semibold">รวม: {total.toLocaleString()} บาท</span>
        </div>

        <div className="flex justify-between items-center mt-2">
          <a
            href={`/${table_number}/`}
            className="bg-gray-200 w-[140px] text-center px-4 py-2 rounded hover:bg-gray-400 text-gray-800"
          >
            กลับ
          </a>

          <button
            className="bg-gray-800 w-[140px] text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={handleOrder}>
            สั่งอาหาร
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuDetail;