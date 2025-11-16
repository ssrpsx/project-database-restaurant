import React from 'react';

interface OrderItem {
  name: string;
  status: string;
  imageURL: string;
  price: number;
  quantity: number;
}

interface OrderRound {
  round: number;
  timestamp: string;
  items: OrderItem[];
}

// Mock data
const mockOrders: OrderRound[] = [
  {
    round: 1,
    timestamp: "2025-11-16 21:00",
    items: [
      { name: "Pizza Margherita", status: "กำลังเตรียม", imageURL: "/image.png", price: 12, quantity: 2 },
      { name: "Burger Classic", status: "เสร็จแล้ว", imageURL: "/image.png", price: 10, quantity: 2 },
    ],
  },
  {
    round: 2,
    timestamp: "2025-11-16 21:30",
    items: [
      { name: "Sushi Roll", status: "กำลังเตรียม", imageURL: "/image.png", price: 15, quantity: 3 },
    ],
  },
];

const OrderList: React.FC = () => {
  // คำนวณยอดรวมทั้งหมด
  const totalPrice = mockOrders.reduce(
    (sum, round) => sum + round.items.reduce((s, item) => s + item.price * item.quantity, 0),
    0
  );

  return (
    <div className="p-4 container mx-auto flex flex-col gap-4 lg:w-xl sm:mt-4">
      {/* Header row */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">รายการที่สั่ง</h1>
        <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" onClick={() => alert("กลับ")}>
          กลับ
        </button>
      </div>

      {/* Loop รอบที่ n */}
      <div className="flex flex-col gap-4">
        {mockOrders.map((round) => (
          <div key={round.round} className="flex flex-col gap-2">
            {/* Row 2: รอบ / timestamp */}
            <div className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded">
              <span className="text-gray-800 font-semibold">รอบที่ {round.round}</span>
              <span className="text-gray-500 text-sm">{round.timestamp}</span>
            </div>

            {/* รายการสินค้าในรอบ */}
            <div className="flex flex-col gap-2">
              {round.items.map((item, idx) => (
                <div key={idx} className="flex bg-white rounded-lg shadow-md overflow-hidden">
                  {/* ซ้าย 1/3: รูป */}
                  <div className="w-1/3">
                    <img src={item.imageURL} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  {/* กลาง 1/3: ชื่อ + สถานะ */}
                  <div className="w-1/3 flex flex-col justify-center px-4">
                    <span className="text-gray-800 font-semibold">{item.name}</span>
                    <span className="text-orange-400 mt-2">{item.status}</span>
                  </div>

                  {/* ขวา 1/3: รวม + price * quantity */}
                  <div className="w-1/3 flex flex-col justify-center items-end px-4">
                    <span className="text-gray-800 text-sm font-semibold">
                      รวม: {(item.price * item.quantity).toLocaleString()} บาท
                    </span>
                    <span className="text-gray-500">
                      {item.price} x {item.quantity} บาท
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom fixed section */}
      <div className="mt-auto flex flex-col gap-2">
        {/* ยอดรวม */}
        <div className="flex justify-between items-center bg-gray-100 text-gray-800 px-4 py-2 rounded">
          <span className="font-semibold">ยอดรวมทั้งหมด</span>
          <span className="font-bold">{totalPrice.toLocaleString()} บาท</span>
        </div>

        {/* ปุ่มปิด */}
        <a
          href='/'
          className="w-full text-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          ปิด
        </a>
      </div>
    </div>
  );
};

export default OrderList;
