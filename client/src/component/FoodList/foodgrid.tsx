import React, { useEffect, useState, useRef } from 'react';
import FoodItem from './fooditem';
import { Link, useParams } from 'react-router-dom';

interface RawCategory {
  ID: number;
  NAME: string;
}

interface RawMenu {
  ID: number;
  NAME: string;
  PRICE: number;
  IMAGE_URL: string;
  CATEGORY_ID: number;
}

interface FoodData {
  id: number;
  name: string;
  price: string;
  imageURL: string;
  category: string;
}

interface CategoryFood {
  id: number;
  category: string;
  items: FoodData[];
}

const FoodGrid: React.FC = () => {
  const [foodByCategory, setFoodByCategory] = useState<CategoryFood[]>([]);
  const [loading, setLoading] = useState(true);
  const { table_number } = useParams();

  const categoryRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_BASE_URL;

        const [catRes, menuRes] = await Promise.all([
          fetch(`${API_URL}/api/settings/get_category`),
          fetch(`${API_URL}/api/settings/get_menus`)
        ]);

        const rawCategories: RawCategory[] = await catRes.json();
        const rawMenus: RawMenu[] = await menuRes.json();

        const result: CategoryFood[] = rawCategories.map((cat) => {
          const itemsInCat = rawMenus.filter((m) => m.CATEGORY_ID === cat.ID);

          const formattedItems: FoodData[] = itemsInCat.map((m) => ({
            id: m.ID,
            name: m.NAME,
            price: `${m.PRICE} ฿`,
            imageURL: m.IMAGE_URL ? `${m.IMAGE_URL}` : 'image.png',
            category: cat.NAME
          }));

          return {
            id: cat.ID,
            category: cat.NAME,
            items: formattedItems
          };
        });

        setFoodByCategory(result);
      }
      catch (err) {
        console.error("Error fetching food data:", err);
      }
      finally {
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

  categoryRefs.current = [];

  return (
    <section id="food" className="container mx-auto mt-6">
      <div className="flex overflow-x-auto gap-4 mb-6 px-2 scrollbar-none">
        <Link to={`/${table_number}/order`}>
          <button
            className="bg-gray-800 w-[150px] text-white px-4 py-2 rounded hover:bg-orange-600 shrink-0 "
          >
            ออเดอร์ที่ฉันสั่ง
          </button>
        </Link>
        {foodByCategory.map((cat, idx) => (
          <button
            key={idx}
            className="bg-gray-200 text-gray-800 shadow-2xl px-4 py-2 rounded hover:bg-orange-600 text-nowrap"
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
                to={`/${table_number}/menu/${food.id}`}
              >
                <FoodItem
                  name={food.name}
                  price={food.price}
                  imageURL={food.imageURL}
                />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default FoodGrid;