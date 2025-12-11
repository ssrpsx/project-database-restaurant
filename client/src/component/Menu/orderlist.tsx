import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface OrderItem {
  item_id: number;
  name: string;
  status: string;
  imageURL: string;
  price: number;
  quantity: number;
}

interface OrderRound {
  round_id: number;
  timestamp: string;
  status: string;
  items: OrderItem[];
}

const OrderList: React.FC = () => {
  const { table_number } = useParams();
  const [orders, setOrders] = useState<OrderRound[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 1. Fetch Data Logic (เหมือนเดิม) ---
  useEffect(() => {
    const fetchOrders = async () => {
      if (!table_number) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings/get_orders_by_table/${table_number}`);
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [table_number]);

  // คำนวณยอดรวม
  const totalPrice = orders.reduce(
    (sum, round) => sum + round.items.reduce((s, item) => s + item.price * item.quantity, 0),
    0
  );

  if (loading) return <div className="p-10 text-center">กำลังโหลดรายการอาหาร...</div>;

  // --- 2. Layout (กลับไปใช้ดีไซน์เดิม) ---
  return (
    <div className="p-4 container mx-auto flex flex-col mt-14 gap-4 lg:w-xl sm:mt-4 pb-20 min-h-screen">

      {/* Header row */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">รายการที่สั่ง</h1>
          {/* แสดงเลขโต๊ะ */}
          <span className="text-sm text-gray-500 font-semibold">โต๊ะ {table_number}</span>
        </div>
        <Link to={`/${table_number}/`} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 text-gray-800">
          กลับ
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center text-gray-400 mt-10">ยังไม่มีรายการอาหารที่สั่ง</div>
      ) : (
        /* Loop รอบที่ n */
        <div className="flex flex-col gap-4">
          {orders.map((round, index) => (
            <div key={round.round_id} className="flex flex-col gap-2">

              {/* Row 2: Header ของรอบ (Round / Timestamp) */}
              <div className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded">
                <span className="text-gray-800 font-semibold">รอบที่ {index + 1}</span>
                <div className="flex flex-col items-end">
                  <span className="text-gray-500 text-sm">
                    {new Date(round.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {/* แสดงสถานะรวมของรอบ (ถ้ามี) */}
                  <span className={`text-xs ${round.status === 'pending' ? 'text-red-500' :
                      round.status === 'preparing' ? 'text-orange-500' : 'text-green-600'
                    }`}>
                    {round.status}
                  </span>
                </div>
              </div>

              {/* รายการสินค้าในรอบ */}
              <div className="flex flex-col gap-2">
                {round.items.map((item, idx) => (
                  <div key={idx} className="flex bg-white rounded-lg shadow-md overflow-hidden h-24">

                    <div className="w-1/3 relative">
                      <img
                        src={item.imageURL ? `${item.imageURL}` : '/image.png'}
                        alt={item.name}
                        className="w-full h-full object-cover absolute inset-0"
                        onError={(e) => e.currentTarget.src = "https://placehold.co/100"}
                      />
                    </div>

                    {/* กลาง 1/3: ชื่อ + สถานะ */}
                    <div className="w-1/3 flex flex-col justify-center px-4 border-r border-gray-100">
                      <span className="text-gray-800 font-semibold line-clamp-2 text-sm">{item.name}</span>
                      <span className={`text-xs mt-1 font-medium ${item.status === 'pending' ? 'text-red-500' :
                          item.status === 'preparing' ? 'text-orange-400' :
                            item.status === 'served' ? 'text-green-500' : 'text-gray-400'
                        }`}>
                        {item.status}
                      </span>
                    </div>

                    {/* ขวา 1/3: รวมเงิน */}
                    <div className="w-1/3 flex flex-col justify-center items-end px-4 bg-gray-50">
                      <span className="text-gray-800 text-sm font-bold">
                        {(item.price * item.quantity).toLocaleString()} ฿
                      </span>
                      <span className="text-gray-500 text-xs">
                        {item.price} x {item.quantity}
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom fixed section (Sticky Bottom) */}
      {orders.length > 0 && (
        <div className="mt-auto flex flex-col gap-2 sticky bottom-4 z-10">
          {/* ยอดรวม */}
          <div className="flex justify-between items-center bg-white border border-gray-200 text-gray-800 px-4 py-3 rounded shadow-lg">
            <span className="font-semibold">ยอดรวมทั้งหมด</span>
            <span className="font-bold text-xl">{totalPrice.toLocaleString()} บาท</span>
          </div>

          {/* ปุ่มปิด */}
          <Link
            to={`/${table_number}/`}
            className="w-full text-center bg-red-500 text-white px-4 py-3 rounded hover:bg-red-600 font-bold shadow-lg"
          >
            ปิด / ชำระเงิน
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderList;