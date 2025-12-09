import React, { useEffect, useState, useRef } from 'react';
import FoodItem from './fooditem';
import { Link } from 'react-router-dom';

interface FoodData {
  name: string;
  price: string;
  imageURL: string;
  category: string;
}

interface CategoryFood {
  category: string;
  items: FoodData[];
}

const FoodGrid: React.FC = () => {
  const [foodByCategory, setFoodByCategory] = useState<CategoryFood[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    'ผัด',             // ผัดไทย, ผัดซีอิ๊ว ฯลฯ
    'ต้ม',             // ต้มยำ, ต้มข่า ฯลฯ
    'แกง',             // แกงเขียวหวาน, แกงส้ม ฯลฯ
    'ยำ',              // ยำวุ้นเส้น, ยำรวมมิตร ฯลฯ
    'ส้มตำ',           // ส้มตำไทย, ส้มตำปู ฯลฯ
    'ก๋วยเตี๋ยว',      // ก๋วยเตี๋ยวเรือ, ก๋วยเตี๋ยวน้ำตก ฯลฯ
    'ราดหน้า',         // ราดหน้าหมู, ราดหน้าไก่ ฯลฯ
    'อาหารทะเล',       // ปลาหมึกทอด, กุ้งเผา ฯลฯ
    'สเต็ก',           // สเต็กหมู, สเต็กไก่ ฯลฯ
    'อาหารจานเดียว',    // ข้าวมันไก่, ข้าวหน้าเป็ด ฯลฯ
    'ของทอด',         // ไก่ทอด, หมูทอด, ทอดมัน ฯลฯ
    'ของหวาน',         // ข้าวเหนียวมะม่วง, กล้วยบวชชี ฯลฯ
    'เครื่องดื่ม'     // น้ำเปล่า, ชาเย็น, น้ำสมุนไพร ฯลฯ
  ];


  // refs สำหรับ scroll
  const categoryRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: CategoryFood[] = [];

        for (let i = 0; i < categories.length; i++) {
          const category = categories[i];
          await new Promise((resolve) => setTimeout(resolve, 100));

          const mockData: FoodData[] = [
            { name: `${category} 1`, price: `$${10 + i}`, imageURL: '/image.png', category },
            { name: `${category} 2`, price: `$${12 + i}`, imageURL: '/image.png', category },
            { name: `${category} 3`, price: `$${14 + i}`, imageURL: '/image.png', category },
          ];

          result.push({ category, items: mockData });
        }

        setFoodByCategory(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading...</p>;

  const scrollToCategory = (index: number) => {
    const element = categoryRefs.current[index];
    if (element) {
      const navbarHeight = 80;
      const y = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // reset refs array ทุกครั้งก่อน map
  categoryRefs.current = [];

  return (
    <section id="food" className="container mx-auto mt-6">
      <div className="flex overflow-x-auto gap-4 mb-6 px-2 scrollbar-none">\
        <Link to="/order">
          <button
            className="bg-[#181818] w-[150px] text-white px-4 py-2 rounded hover:bg-orange-600 shrink-0 "
          >
            ออเดอร์ที่ฉันสั่ง
          </button>
        </Link>
        {foodByCategory.map((cat, idx) => (
          <button
            key={idx}
            className="bg-[#181818] text-white px-4 py-2 rounded hover:bg-orange-600 text-nowrap"
            onClick={() => scrollToCategory(idx)}
          >
            {cat.category}
          </button>
        ))}
      </div>

      {foodByCategory.map((cat, idx) => (
        <div
          key={idx}
          ref={(el) => void (categoryRefs.current[idx] = el)}
          className="mb-8"
        >
          <h2 className="text-2xl text-gray-800 font-bold mb-4 ml-6 sm:ml-0">{cat.category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cat.items.map((food, index) => (
              <Link
                key={index}
                to={`/menu`}
              >
                <FoodItem key={index} {...food} />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default FoodGrid;
