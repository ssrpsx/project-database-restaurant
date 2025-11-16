import React, { useState } from 'react';

const MenuDetail: React.FC = () => {
  const [quantity, setQuantity] = useState(1);

  const restaurantName = "My Restaurant";
  const foodName = "Pizza";
  const price = 12;
  const imageURL = "image.png";

  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => setQuantity(prev => Math.max(prev - 1, 1));

  const total = price * quantity;

  return (
    <div className="flex flex-col h-screen p-4 container mx-auto pt-8">
      {/* ส่วนบน: ชื่อร้าน + รูป + ชื่อ + ราคา */}
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold">{restaurantName}</h1>

        <div className="w-full lg:m-auto lg:my-4 overflow-hidden rounded-lg">
          <img src={imageURL} alt={foodName} className="w-full h-full object-cover lg:w-auto lg:h-full lg:m-auto" />
        </div>

        <div className="flex justify-between items-center mt-2">
          <h2 className="text-gray-800 text-2xl font-semibold">{foodName}</h2>
          <p className="text-xl font-bold text-gray-800">{price.toLocaleString()} บาท</p>
        </div>
      </div>

      {/* ส่วนล่าง: Row 1 + Row 2 */}
      <div className="mt-auto flex flex-col gap-2">
        {/* Row 1: + จำนวน - / Total */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 w-[200px]">
            <button
              className="bg-gray-300 text-gray-800 px-3 py-1 w-10 h-10 rounded hover:bg-red-600"
              onClick={handleDecrease}
            >
              -
            </button>
            <span className="w-11 text-center text-gray-800 text-lg">{quantity}</span>
            <button
              className="bg-gray-300 text-gray-800 px-3 py-1 w-10 h-10 rounded hover:bg-red-600"
              onClick={handleIncrease}
            >
              +
            </button>
          </div>

          <span className="text-gray-800 text-lg font-semibold">รวม: {total.toLocaleString()} บาท</span>
        </div>

        {/* Row 2: กลับ / สั่งอาหาร */}
        <div className="flex justify-between items-center mt-2">
          <a
            href='/'
            className="bg-gray-400 w-[140px] text-center px-4 py-2 rounded hover:bg-gray-400"
          >
            กลับ
          </a>

          <button
            className="bg-red-500 w-[140px] text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => alert('สั่งอาหาร')}>
            สั่งอาหาร
          </button>
        </div>
      </div>
    </div>

  );
};

export default MenuDetail;
